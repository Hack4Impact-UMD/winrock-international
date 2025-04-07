type Result =
    | { success: true, data?: any }
    | { success: false; errorCode: string };

export default Result;