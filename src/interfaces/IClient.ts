export interface IClient {
    id: number;
    name: string;
    email: string;
    cpf: string;
    cep?: string;          
    street?: string;     
    number?: string;       
    district?: string;     
    city?: string;       
    state?: string;        
}
