import { ApiError } from "../helpers/api-error";

export class ClientParser {
    static parseClientId(query: any): number | undefined {
        const { client_id, client } = query;
        let clientId: number | undefined;

        if (typeof client_id === 'string') {
            clientId = parseInt(client_id, 10);
            if (isNaN(clientId)) {
                throw new ApiError('ID de cliente inválido.', 400);
            }
        }

        if (typeof client === 'string') {
            const clientFromQuery = parseInt(client, 10);
            if (!isNaN(clientFromQuery)) {
                clientId = clientFromQuery;
            }
        }

        return clientId;
    }
}
