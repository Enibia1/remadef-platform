/* ==========================================================
   REMADEF PLATFORM
   Module Registration
   File: src/modules/index.ts

   Register every platform module here.
========================================================== */

import Registry from "./registry";

/* ==========================================================
   FEATURE MODULES
========================================================== */

import HomeModule from "./home";

import ProfileModule from "./profile";

import MessagesModule from "./messages";

import LearningModule from "./learning";

import ApprenticeshipModule from "./apprenticeship";

import BusinessModule from "./business";

import WalletModule from "./wallet";

import EscrowModule from "./escrow";

import NotificationModule from "./notifications";

import SearchModule from "./search";

import DirectoryModule from "./directory";

import SettingsModule from "./settings";

import HelpModule from "./help";

/* ==========================================================
   REGISTER MODULES
========================================================== */

Registry.register(HomeModule);

Registry.register(ProfileModule);

Registry.register(MessagesModule);

Registry.register(LearningModule);

Registry.register(ApprenticeshipModule);

Registry.register(BusinessModule);

Registry.register(WalletModule);

Registry.register(EscrowModule);

Registry.register(NotificationModule);

Registry.register(SearchModule);

Registry.register(DirectoryModule);

Registry.register(SettingsModule);

Registry.register(HelpModule);

/* ==========================================================
   EXPORTS
========================================================== */

export {
    Registry
};

export default Registry;
