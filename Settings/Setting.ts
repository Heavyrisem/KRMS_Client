export interface Setting {
    language: "KO" | "EN",
    Server: {
        Name: string,
        KRMS_Account: {
            name: string,
            passwd: string
        }
    }
}