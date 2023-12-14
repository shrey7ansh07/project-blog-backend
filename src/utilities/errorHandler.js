class ErrorDealer extends Error {
    constructor(
        statusCode,
        Errormessage= "didn't went well",
        error = [],
        errorStack = ""
    )
    {
        super(message)
        this.statusCode = statusCode,
        this.data =  null,
        this.message = Errormessage,
        this.success = false,
        this.errors = error,
        this.stack = errorStack
    }
}

export {ErrorDealer}