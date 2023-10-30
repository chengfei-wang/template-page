const default_headers: { [key: string]: string; } = {
    "Content-Type": "application/json;charset=utf-8",
}

const protocol = document.location.protocol
const host = (document.location.host + ":").split(":")[0] //防止本身有端口时出现两次端口号
const port = "20000"

export function api(route: string): string {
    return `${protocol}//${host}:${port}/${route}`
}

export function request(route: string, body: { [key: string]: any; }, callback: (status: number, obj: Response) => void, headers: { [key: string]: string; } = default_headers) {
    let token = window.localStorage.getItem("token")
    if (token != null) {
        headers = {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": token
        }
    }
    let form = new Request(api(route), {
        method: 'POST',
        credentials: "same-origin",
        headers: headers,
        body: JSON.stringify(body)
    })

    fetch(form).then(result => result.json().then(obj => callback(result.status, obj)))
}

export function request_urlencoded(route: string, form_data: FormData, callback: (status: number, obj: Response) => void, headers: { [key: string]: string; }) {
    let form = new Request(api(route), {
        method: 'POST',
        credentials: "same-origin",
        headers: headers,
        body: form_data
    })

    fetch(form).then(result => result.json().then(obj => callback(result.status, obj)))
}

export interface Response {
    code: number
    message: string
    data: any | null
}