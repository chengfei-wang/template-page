export function random_id(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const len = chars.length
    let s = ''
    for (let i = 0; i < 32; i++) {
        s += chars.charAt(Math.floor(Math.random() * len))
    }
    return s
}

export interface SlotProp {
    size: number
    children: Widget[]
}

export function clone_slot_props(props: Array<SlotProp>): SlotProp[] {
    return props.map(value => ({ size: value.size, children: [] }))
}

export interface FormProp {
    method?: string
    url?: string
}

export interface Widget<T = {}> {
    id: string
    type: string
    node_prop: NodeProp
    children: SlotProp[]
    form_prop: FormProp
    universal_prop: T
}

export interface ClassProp {
    textColor?: string
    textSize?: string
    backgroundColor?: string
    textAlign?: string
}

export interface NodeProp {
    clazz?: ClassProp
    name?: string
    content?: string
    url?: string
    styles?: { [key: string]: string }
    type?: string
}

export interface ClassItem {
    className: string
    classDesc: string
}

export interface FormMethod {
    name: string
}

export const class_group: {
    textColor: ClassItem[],
    backgroundColor: ClassItem[],
    textSize: ClassItem[],
    textAlign: ClassItem[]
} = {
    textColor: [
        { className: 'mdui-text-color-green', classDesc: '绿色' },
        { className: 'mdui-text-color-blue', classDesc: '蓝色' },
        { className: 'mdui-text-color-red', classDesc: '红色' },
        { className: 'mdui-text-color-yellow', classDesc: '黄色' },
        { className: 'mdui-text-color-purple', classDesc: '紫色' },
        { className: 'mdui-text-color-orange', classDesc: '橙色' },
        { className: 'mdui-text-color-pink', classDesc: '粉色' },
        { className: 'mdui-text-color-grey', classDesc: '灰色' },
        { className: 'mdui-text-color-black', classDesc: '黑色' },
        { className: 'mdui-text-color-white', classDesc: '白色' },
        { className: 'mdui-text-color-blue-grey', classDesc: '蓝灰色' },
        { className: 'mdui-text-color-deep-purple', classDesc: '深紫色' },
        { className: 'mdui-text-color-indigo', classDesc: '靛青色' },
        { className: 'mdui-text-color-cyan', classDesc: '青色' },
        { className: 'mdui-text-color-teal', classDesc: '青绿色' },
        { className: 'mdui-text-color-lime', classDesc: '黄绿色' },
        { className: 'mdui-text-color-light-green', classDesc: '浅绿色' },
        { className: 'mdui-text-color-deep-orange', classDesc: '深橙色' },
        { className: 'mdui-text-color-brown', classDesc: '褐色' },
    ],
    backgroundColor: [
        { className: "mdui-color-green", classDesc: "绿色" },
        { className: "mdui-color-blue", classDesc: "蓝色" },
        { className: "mdui-color-white", classDesc: "白色" },
        { className: "mdui-color-black", classDesc: "黑色" },
        { className: "mdui-color-red", classDesc: "红色" },
        { className: "mdui-color-yellow", classDesc: "黄色" },
        { className: "mdui-color-orange", classDesc: "橙色" },
        { className: "mdui-color-cyan", classDesc: "青色" },
        { className: "mdui-color-purple", classDesc: "紫色" },
        { className: "mdui-color-blue-grey", classDesc: "蓝灰色" },
        { className: "mdui-color-light-blue", classDesc: "浅蓝色" },
        { className: "mdui-color-pink", classDesc: "粉色" },
        { className: "mdui-color-grey", classDesc: "灰色" },
        { className: "mdui-color-teal", classDesc: "青绿色" },
        { className: "mdui-color-deep-orange", classDesc: "深橙色" },
        { className: "mdui-color-deep-purple", classDesc: "深紫色" },
        { className: "mdui-color-indigo", classDesc: "靛青色" },
        { className: "mdui-color-light-green", classDesc: "浅绿色" },
        { className: "mdui-color-brown", classDesc: "褐色" },
    ],
    textSize: [
        { className: "mdui-typo-headline", classDesc: "大标题" },
        { className: "mdui-typo-title", classDesc: "标题" },
        { className: "mdui-typo-subheading", classDesc: "副标题" },
        { className: "mdui-typo-body-1", classDesc: "正文1" },
        { className: "mdui-typo-body-2", classDesc: "正文2" },
        { className: "mdui-typo-caption", classDesc: "提示文字" },
    ],
    textAlign: [
        { className: "mdui-text-left", classDesc: "format_align_left" },
        { className: "mdui-text-center", classDesc: "format_align_center" },
        { className: "mdui-text-right", classDesc: "format_align_right" },
    ]
}

export const input_type_group: { type: string, desc: string }[] = [
    { type: 'text', desc: '文本' },
    { type: 'password', desc: '密码' },
    { type: 'number', desc: '数字' },
    { type: 'email', desc: '邮箱' },
    { type: 'tel', desc: '电话' },
    { type: 'url', desc: '网址' },
    { type: 'date', desc: '日期' },
    { type: 'time', desc: '时间' },
]

export const form_group: { methods: FormMethod[] } = {
    methods: [
        { name: 'GET' },
        { name: 'POST' },
    ]
}

export const config_items = {
    IMAGE: [
        'IMAGE',
    ],
    NAME: [
        'INPUT',
        'CHECKBOX_GROUP',
        'RADIO_GROUP',
    ],
    TYPE: [
        'INPUT',
    ],
    FORM_METHOD: [
        'FORM',
    ],
    CONTAINER: [
        'CONTAINER',
        'FORM',
    ],
}

export function is_container(widget: Widget): boolean {
    return config_items.CONTAINER.includes(widget.type)
}