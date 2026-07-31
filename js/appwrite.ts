/* ==========================================================
   REMADEF PLATFORM
   APPWRITE INITIALIZATION
   File: js/appwrite.ts

   PURPOSE
   ----------------------------------------------------------
   • Initialize Appwrite
   • Export all Appwrite services
   • Use config.ts only
========================================================== */

import { Client } from "appwrite";
import { Account } from "appwrite";
import { Databases } from "appwrite";
import { Storage } from "appwrite";
import { Functions } from "appwrite";
import { Avatars } from "appwrite";

import CONFIG from "./config";

/* ==========================================================
   CLIENT
========================================================== */

const client = new Client();

client
    .setEndpoint(
        CONFIG.appwrite.endpoint
    )
    .setProject(
        CONFIG.appwrite.projectId
    );

/* ==========================================================
   SERVICES
========================================================== */

export const account =
    new Account(client);

export const databases =
    new Databases(client);

export const storage =
    new Storage(client);

export const functions =
    new Functions(client);

export const avatars =
    new Avatars(client);

/* ==========================================================
   DATABASE
========================================================== */

export const DATABASE_ID =
    CONFIG.appwrite.databaseId;

/* ==========================================================
   TABLES
========================================================== */

export const TABLES =
    CONFIG.appwrite.tables;

/* ==========================================================
   FUNCTION
========================================================== */

export const FUNCTION_ID =
    CONFIG.appwrite.functionId;

/* ==========================================================
   STORAGE
========================================================== */

export const STORAGE_BUCKET_ID =
    CONFIG.appwrite.storageBucketId;

/* ==========================================================
   APPWRITE OBJECT
========================================================== */

const Appwrite = {

    client,

    account,

    databases,

    storage,

    functions,

    avatars,

    DATABASE_ID,

    TABLES,

    FUNCTION_ID,

    STORAGE_BUCKET_ID

};

/* ==========================================================
   GLOBAL ACCESS
========================================================== */

if (typeof window !== "undefined") {

    (window as any).Appwrite =
        Appwrite;
}

/* ==========================================================
   EXPORTS
========================================================== */

export {

    client

};

export default Appwrite;
