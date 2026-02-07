export interface CrearUsuarioRequest {
    email: string;
    passwordHash: string;
}

export interface UsuarioResponse {
    id: string;
    email: string;
}
