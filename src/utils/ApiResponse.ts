class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    constructor(statusCode: any, data: any, message = 'Success') {
        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
}
export default ApiResponse;