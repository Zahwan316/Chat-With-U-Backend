type UserType = {
    id: string,
    fullname: string,
    username: string,
    email: string,
    bio: string,
    image: string,
    created_Date: string,
    number_phone: string,
    password: string,
    destroy?: () => void,
    update: () => void
}

export default UserType