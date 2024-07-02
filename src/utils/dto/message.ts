

export class Message {

    constructor() { };

    private static getResidenceMessage(residence: string): string {

        return `Hello There! \n 

        You are receving  this message because a lost pet has been reported or seen \r

        near by your residence: ${residence}. \n

        Stay alert and be on the lookout for any possible lost pet\n

        Open the app and get more info on this alert\n

        Our best regardsn\
        Fido Finder Team

        `;

    }

    private static getLocationMessage(location: string): string {

        return `Hello There! \n 

        You are receving  this message because a lost pet has been reported or seen \r 
        near by your location at: ${location}. \n

        Beware of your surroundings! You may be able to contribute to the search \r
        and help someone recover his/her lost pet! \n

        Open the app and get more info on this alert nearby you\n

        Our best regards\n
        Fido Finder Team

        `;

    }

    private static getCommunityMessage(community: string): string {

        return `Hello There! \n 

        You are receving  this message because a lost pet has been reported or seen \r 
        near by your community ${community}. \n

        Beware of your surroundings! You may be able to contribute to the search \r
        and help someone recover his/her lost pet! \n

        Open the app and get more info on this alert nearby you\n

        Our best regards\n
        Fido Finder Team

        `;

    }

    private static getCustomSingleMessage(username: string, body: string) {

        const message = "Hello " + username + "! \n" + body;
        return message

    }

    private static getEasterEgg(easter: string) {

        return `Hola estimado \n
        
        Si has recibido este correo, es porque se han detectado altos niveles de ${easter} en tu ubicación \n

        Por favor, por tu seguridad, hemos enviado a las fuerzas especiales a tu ubicación, para controlar los niveles tan altos de \r
        ${easter} encontrados. Por favor, no te muevas, los agentes llegaran en unos minutos


        Fido Finder
        
        `;


    }

    public static getMessage(option: string, geography: string): string {
        if (option == "residence")
            return this.getResidenceMessage(geography);
        else if (option == "location")
            return this.getLocationMessage(geography);
        else if (option == "community")
            return this.getCommunityMessage(geography)
        else if (option == "easter")
            return this.getEasterEgg(geography)
        return "Generic template message"

    }


}