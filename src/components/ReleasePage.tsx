import { computed, ComputedRef, defineComponent, ref } from "vue";
import mdui from "mdui";
import { request } from "../Request";
import { GROUP_USER_VERIFY, PageInfo, template_render_function } from "./Template";
import { ElButton, ElCol, ElDialog, ElInput, ElResult, ElRow } from "element-plus";

function is_email(email: string) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}


const UserVerifyPage = defineComponent({
    name: "UserVerifyPage",
    props: {
        page: {
            type: String,
        }
    },
    setup({ page }, { emit }) {
        const user = ref<string>()
        const verify_code = ref<string>()
        const code_info = ref<{ codeId: string, codeExpire: Date }>()

        const get_verify_code = () => {
            // check user is valid email
            if (user.value && is_email(user.value)) {
                request(`verify/send/${page}`, { email: user.value }, (status, obj) => {
                    if (status === 200 && obj.code === 200 && obj.data) {
                        code_info.value = { codeId: obj.data.codeId, codeExpire: new Date(obj.data.codeExpire) }
                        mdui.snackbar({
                            message: '验证码已发送，请注意查收',
                            position: 'bottom',
                        });
                        console.log(code_info.value)
                    } else {
                        mdui.snackbar({
                            message: obj.message || '验证码发送失败',
                            position: 'bottom',
                        });
                    }
                })
            } else {
                mdui.snackbar({
                    message: "请输入正确的信息",
                    position: "bottom",
                });
                return
            }
        }

        const send_verify_code = () => {
            if (code_info.value) {
                if (verify_code.value && verify_code.value.length > 0) {
                    request(`verify/${code_info.value.codeId}`, { codeValue: verify_code.value }, (status, obj) => {
                        if (status === 200 && obj.code === 200 && obj.data?.token) {
                            let token: string = obj.data.token
                            mdui.snackbar({
                                message: "验证成功",
                                position: "bottom",
                            });
                            emit('putSubmitToken', token)
                        } else {
                            mdui.snackbar({
                                message: obj.message || '验证失败',
                                position: 'bottom',
                            });
                        }
                    })
                } else {
                    mdui.snackbar({
                        message: "请输入验证码",
                        position: "bottom",
                    });
                }
            } else {
                mdui.snackbar({
                    message: "请先获取验证码",
                    position: "bottom",
                });
            }
        }

        return () => (
            <div>
                <ElRow>
                    <ElCol span={24}>
                        <ElInput placeholder="请输入邮箱" type='email' v-model={user.value} />
                    </ElCol>
                </ElRow>
                <div class='normal-divider-micro'></div>
                <ElRow>
                    <ElCol span={14}>
                        <ElInput placeholder="输入验证码" v-model={verify_code.value} />
                    </ElCol>

                    <ElCol span={2} />

                    <ElCol span={8}>
                        <ElButton type="primary" style='width: 100%' onClick={() => get_verify_code()} disabled={code_info.value !== undefined}>
                            获取验证码
                        </ElButton>
                    </ElCol>
                </ElRow>
                <div class='normal-divider-micro'></div>
                <ElRow>
                    <ElCol span={24}>
                        <ElButton type="primary" style='width: 100%' onClick={() => { send_verify_code() }} disabled={code_info.value === undefined}>
                            提交
                        </ElButton>
                    </ElCol>
                </ElRow>
            </div>
        )
    },
    emits: ["putSubmitToken"],
});

const ReleasePage = defineComponent({
    name: "ReleasePage",
    props: {
        page: {
            type: String,
        }
    },
    setup({ page }) {
        const page_info = ref<PageInfo>()
        const need_verify: ComputedRef<boolean> = computed(() => {
            if (page_info.value != undefined && page_info.value.submitToken == undefined) {
                if (page_info.value.userVerify == GROUP_USER_VERIFY.email) {
                    return true;
                } else if (page_info.value.userVerify == GROUP_USER_VERIFY.tel) {
                    return true;
                }
            }
            return false;
        })

        const access_page = () => {
            request(`access/${page}`, {}, (status, obj) => { console.log(status, obj) })
        }

        const get_page_info = () => {
            request(`page/${page}`, {}, (status, obj) => {
                if (status == 200 && obj.code == 200 && obj.data != null) {
                    console.log("data", obj.data)
                    const data = obj.data
                    page_info.value = {
                        pageId: data.pageId,
                        title: data.title,
                        elements: JSON.parse(data.elements),
                        deployType: data.deployType,
                        userVerify: data.userVerify,
                        deployAddition: data.deployAddition.split(' ')
                    }
                    console.log("elements", page_info.value)
                } else {
                    mdui.snackbar({
                        message: "获取页面失败",
                        position: "bottom",
                    })
                }
            })
        }

        const page_content = (page_info?: PageInfo) => {
            if (page_info) {
                return (
                    <div>
                        {page_info.elements.map(element => {
                            return template_render_function(element).render(element, page_info)
                        })}
                    </div>
                )
            } else {
                return (
                    <div>
                        <ElResult
                            icon="error"
                            title="页面不存在"
                            sub-title="请尝试刷新页面重试"
                            v-slots={{
                                "extra": () => (
                                    <ElButton type="primary" onClick={() => location.reload()}>刷新</ElButton>
                                )
                            }}>
                        </ElResult>
                    </div>
                )
            }
        }

        access_page()
        get_page_info()

        return () => (
            <div>
                <ElDialog
                    modelValue={need_verify.value}
                    title='身份验证' width={350}
                    closeOnClickModal={false}
                    closeOnPressEscape={false}
                    showClose={false}
                    center={true}
                >
                    <UserVerifyPage page={page} onPutSubmitToken={(token: string) => { if (page_info.value) { page_info.value.submitToken = token } }} />
                </ElDialog>
                <div class='mdui-container'>
                    <div class='mdui-col-md-4 mdui-col-sm-2'></div>
                    <div class='mdui-col-md-4 mdui-col-sm-8'>
                        {page_content(page_info.value)}
                    </div>
                    <div class='mdui-col-md-4 mdui-col-sm-2'></div>
                </div>
            </div>
        )
    },
    components: {
        ElResult,
        ElButton
    }
});

export default ReleasePage;