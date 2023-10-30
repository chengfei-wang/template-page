import mdui from "mdui";
import { request_urlencoded } from "../Request";
import { Widget, ClassProp, FormProp, SlotProp } from "../Widget";

export interface PageInfo {
    pageId: string
    title: string
    elements: Widget[]
    deployType: string
    userVerify: string
    deployAddition: string[]

    submitToken?: string
}

export const GROUP_DEPLOY_TYPE = { static: "DEPLOY_TYPE_STATIC", dynamic: "DEPLOY_TYPE_DYNAMIC" };
export const GROUP_USER_VERIFY = { none: "USER_VERIFY_NONE", email: "USER_VERIFY_EMAIL", tel: "USER_VERIFY_TEL" };
export const GROUP_DEPLOY_ADDITION = { access_stats: "DEPLOY_ADDITION_ACCESS_STATS", export_data: "DEPLOY_ADDITION_EXPORT_DATA", large_data: "DEPLOY_ADDITION_LARGE_DATA" };

function form_action(payload: Event, page_info: PageInfo) {
    payload.preventDefault();
    const form = payload.target as HTMLFormElement;
    const data = new FormData(form);
    const args: { [key: string]: any[] } = {};
    for (const [key, value] of data.entries()) {
        if (!args[key]) {
            args[key] = [];
        }
        args[key].push(value);
    }
    console.log(args);
    request_urlencoded(`upload/data/${page_info.pageId}`, data, (status, obj) => {
        console.log(status, obj);
        if (status == 200 && obj.code == 200) {
            mdui.snackbar({
                message: "提交成功",
                position: "bottom",
            })
        } else if (status == 200 && obj.code == 400) {
            mdui.snackbar({
                message: obj.message || "提交失败",
                position: "bottom",
            })
        } else {
            mdui.snackbar({
                message: "网络异常",
                position: "bottom",
            })
        }
    }, { "Authorization": page_info.submitToken ?? "" })
}

function button_action(action: string, args: { content: string }[]) {
    console.log(action, args.map(x => x.content));
    if (action === 'open') {
        args.forEach(x => {
            window.open(x.content);
        })
    }
    if (action == 'code') {
       args.forEach(x => {
            eval(x.content);
       })
    }
}

function create_class_list(init: string[], prop?: ClassProp): string[] {
    let classList = Array.from(init)

    if (prop != undefined) {
        if (prop.backgroundColor != undefined) {
            classList.push(prop.backgroundColor)
        }
        if (prop.textColor != undefined) {
            classList.push(prop.textColor)
        }
        if (prop.textSize != undefined) {
            classList.push(prop.textSize)
        }
        if (prop.textAlign != undefined) {
            classList.push(prop.textAlign)
        }
    }

    return classList
}

export interface TemplateWidget<T = {}> {
    name: string
    render(content: Widget<T>, page_info: PageInfo): JSX.Element
    universal_prop(): T
}

const unknown: TemplateWidget = {
    name: "UNKNOWN",
    render() {
        return <div>未知组件</div>
    },
    universal_prop() {
        return {}
    }
}

export const button: TemplateWidget<{ action: string, arguments: any[] }> = {
    name: "BUTTON",
    render(content, page_info) {
        const prop = content.node_prop
        if (prop.content == undefined) {
            prop.content = '普通按钮'
        }
        let classList: string[] = create_class_list(['template-default-button'], prop.clazz)
        const action = content.universal_prop.action
        if (action == undefined || action == '' || action == 'submit') {
            return (<button id={content.id} type="submit" class={classList}>{prop.content}</button>)
        } else {
            const args = content.universal_prop.arguments
            return (<button id={content.id} type="button" class={classList} onClick={() => button_action(action, args)}>{prop.content}</button>)
        }
    },
    universal_prop() {
        return {
            action: '',
            arguments: [],
        }
    },
}

export const text_single: TemplateWidget = {
    name: "TEXT_SINGLE",
    render(content, page_info) {
        const prop = content.node_prop
        if (prop.content == undefined) {
            prop.content = '单行文本'
        }
        let classList: string[] = create_class_list(['template-default-text-single'], prop.clazz)
        return (<p id={content.id} class={classList} style={prop.styles}>{prop.content}</p>)
    },
    universal_prop() {
        return {}
    }
}

export const text_multi: TemplateWidget = {
    name: "TEXT_MULTI",
    render(content, page_info) {
        const prop = content.node_prop
        if (prop.content == undefined) {
            prop.content = '多行文本'
        }
        let classList: string[] = create_class_list(['template-default-text-multi'], prop.clazz)
        return (<p id={content.id} class={classList} style={prop.styles}>{prop.content}</p>)
    },
    universal_prop() {
        return {}
    }
}


export const input: TemplateWidget = {
    name: "INPUT",
    render(content, page_info) {
        const prop = content.node_prop
        if (prop.content == undefined) {
            prop.content = '请输入文本'
        }

        if (prop.type == undefined) {
            prop.type = 'text'
        }


        let classList: string[] = create_class_list(['template-default-input'], prop.clazz)

        return (<input id={content.id} type={prop.type} class={classList} name={prop.name} placeholder={prop.content} />)
    },
    universal_prop() {
        return {}
    },
}

export const image: TemplateWidget = {
    name: "IMAGE",
    render(content, page_info) {
        let prop = content.node_prop
        let classList: string[] = create_class_list(['template-item'], prop.clazz)
        if (prop.url == undefined || prop.url.length == 0) {
            prop.url = '/thumbnail.png'
        }
        if (prop.content === undefined || prop.content.length === 0) {
            return (
                <div>
                    <img id={content.id} class={classList} src={prop.url} alt='图片' />
                </div>
            )
        } else {
            return (
                <div>
                    <img id={content.id} class={classList} src={prop.url} alt='图片' />
                    <div class={['template-image-title', ...classList]}>{prop.content}</div>
                </div>
            )
        }
    },
    universal_prop() {
        return {}
    },
}

export const divider: TemplateWidget = {
    name: "DIVIDER",
    render(content) {
        let prop = content.node_prop
        let classList: string[] = create_class_list([], prop.clazz)
        return (
            <div id={content.id} class={classList}>
                <div class='template-divider'>{prop.content}</div>
            </div>
        )
    },
    universal_prop() {
        return {}
    },
}

export const container: TemplateWidget = {
    name: "CONTAINER",
    render(content, page_info) {
        let children: SlotProp[] = content.children

        let items = children.map((child: SlotProp, index: number) => {
            return (
                <div class={`template-slot-release mdui-col-xs-${child.size}`} id={`${content.id}-${index}`}>
                    {
                        child.children.map(
                            (widget) => {
                                let render = template_render_function(widget)
                                return render.render(widget, page_info)
                            }
                        )
                    }
                </div>
            )
        })

        return (
            <div class="mdui-container-fluid template-container-release" id={content.id}>
                {items}
            </div>
        )
    },
    universal_prop() {
        return {}
    },
}

export const form: TemplateWidget = {
    name: "FORM",
    render(content, page_info) {
        let form_prop: FormProp = content.form_prop

        let children: SlotProp[] = content.children

        let items = children.map((child: SlotProp, index: number) => {
            return (
                <div class={`template-slot-release mdui-col-xs-${child.size}`} id={`${content.id}-${index}`}>
                    <div>
                        {
                            child.children.map(
                                (widget) => {
                                    let render = template_render_function(widget)
                                    return render.render(widget, page_info)
                                }
                            )
                        }
                    </div>
                </div>
            )
        })
        return (
            <form id={content.id} method={form_prop.method} action={form_prop.url} onSubmit={(payload) => form_action(payload, page_info)}>
                <div class="mdui-container-fluid template-container-release">
                    {items}
                </div>
            </form>
        )
    },
    universal_prop() {
        return {}
    },
}

export const radio_group: TemplateWidget<{ options: { label: string, value: string }[] }> = {
    universal_prop() {
        return {
            options: [
                { label: "Option 1", value: "Option 1" },
                { label: "Option 2", value: "Option 2" },
                { label: "Option 3", value: "Option 3" }
            ]
        }
    },
    name: "RADIO_GROUP",
    render(content, page_info): JSX.Element {
        const classList = create_class_list([], content.node_prop.clazz)
        return (
            <div id={content.id} class={classList}>
                <div class="template-default-text-single">
                    {content.node_prop.content}
                </div>
                {content.universal_prop.options.map((option: { label: string, value: string }, index: number) => {
                    return (
                        <div>
                            <label class="mdui-radio">
                                <input type="radio" name={content.node_prop.name} value={option.value} />
                                <i class="mdui-radio-icon"></i>
                                {option.value}
                            </label>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export const checkbox_group: TemplateWidget<{ options: { label: string, value: string }[] }> = {
    universal_prop() {
        return {
            options: [
                { label: "Option 1", value: "Option 1" },
                { label: "Option 2", value: "Option 2" },
                { label: "Option 3", value: "Option 3" }
            ]
        }
    },
    name: "CHECKBOX_GROUP",
    render(content, page_info) {
        const classList = create_class_list([], content.node_prop.clazz)
        return (
            <div id={content.id} class={classList}>
                <div class="template-default-text-single">
                    {content.node_prop.content}
                </div>
                {content.universal_prop.options.map((option: { label: string, value: string }, index: number) => {
                    return (
                        <div>
                            <label class="mdui-checkbox">
                                <input type="checkbox" name={content.node_prop.name} value={option.value} />
                                <i class="mdui-checkbox-icon"></i>
                                {option.value}
                            </label>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export const template_render: { [key: string]: TemplateWidget } = {
    "UNKNOWN": unknown,
    "BUTTON": button,
    "INPUT": input,
    "TEXT_SINGLE": text_single,
    "TEXT_MULTI": text_multi,
    "RADIO_GROUP": radio_group,
    "CHECKBOX_GROUP": checkbox_group,
    "IMAGE": image,
    "DIVIDER": divider,
    "CONTAINER": container,
    "FORM": form,
}

export function template_render_function(widget: Widget): TemplateWidget {
    return template_render[widget.type] || unknown
}