type MessageType = {
    id: string,
    body: string,
    group_id: string,
    user_from_id: string,
    user_target_id: string,
    type:string,
    time: string,
    created_Date: string,
    soft_delete: boolean,
    destroy:() => void,
    update: () => void
}

export default MessageType