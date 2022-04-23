class EndPointNotFoundException extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export { EndPointNotFoundException }