declare module '@liveblocks/node' {
    interface LiveblocksOptions {
      secret: string;
    }
  
    export class Liveblocks {
      constructor(options: LiveblocksOptions);
      // Define other methods and properties as needed
    }
  }
  