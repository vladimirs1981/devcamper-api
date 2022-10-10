export interface IBootcamp {
    name: string,
    slug: string,
    description: string,
    website: string,
    phone: string,
    email: string,
    address: string,
    location: {
        type: {
            type: string,
            enum: string[]
        },
        coordinates: {
            type: number[],
            index: string
        },
        formattedAddress: string,
        street: string,
        city: string,
        state: string,
        zipcode: string,
        country: string,
    }
    careers: string[],
    averageRating: number,
    averageCost: number,
    photo: string,
    housing: boolean,
    jobAssistance: boolean,
    jobGuarantee: boolean,
    acceptGi: boolean,
    createdAt: Date

}