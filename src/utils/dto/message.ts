

class Message {

    constructor() { };

    private static getResidenceMessage(residence: string): string {

        return `Hello There! \n 

        You are receving  this message because a lost pet has been reported or seen \n 
        near by your residence: ${residence}. \n

        Stay alert and be on the lookout for any possible lost pet\n

        Open the app and get more info on this alert\n

        Our best regardsn\
        Fido Finder Team

        `;

    }

    private static getLocationMessage(location: string): string {

        return `Hello There! \n 

        You are receving  this message because a lost pet has been reported or seen \n 
        near by your location at: ${location}. \n

        Beware of your surroundings! You may be able to contribute to the search \n
        and help someone recover his/her lost pet! \n

        Open the app and get more info on this alert nearby you\n

        Our best regards\n
        Fido Finder Team

        `;

    }

    private static getCommunitynMessage(community: string): string {

        return `Hello There! \n 

        You are receving  this message because a lost pet has been reported or seen \n 
        near by your community ${community}. \n

        Beware of your surroundings! You may be able to contribute to the search \n
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


}