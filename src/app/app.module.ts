import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';
import { LoginPage } from '../pages/login/login';
import { RegisterMenuPage } from '../pages/register-menu/register-menu';
import { RegisterPage } from '../pages/register/register';
// import { Service } from '../providers/service';
import { AddPostPage } from '../pages/add-post/add-post'
// import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage'
import { MomentModule } from 'angular2-moment/moment.module';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { GlobalVars } from '../providers/globalvars';
import { PostDetailPage } from '../pages/post-detail/post-detail';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { ChatsPage } from '../pages/chats/chats';
import { StatusSwitcher } from '../pages/chats/status-switcher';
import { AvailabilityPage } from '../pages/availability/availability';
import { ChattingPage } from '../pages/chatting/chatting'
import { PassionsPage } from '../pages/passions/passions';
import { PassionDetailPage } from '../pages/passion-detail/passion-detail';
import { PassionItemsPage } from '../pages/passion-items/passion-items';
import { PassionUsersPage } from '../pages/passion-users/passion-users';
import { SettingsPage } from '../pages/settings/settings';
import { ContactPage } from '../pages/contact/contact';
import { FeedbackPage } from '../pages/feedback/feedback';
import { TermsPage } from '../pages/legals/terms';
import { PrivacyPage } from '../pages/legals/privacy';
import { InAppBrowser} from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    HomePage,
    TabsPage,
    StartPage,
    LoginPage,
    RegisterMenuPage,
    RegisterPage,
    AddPostPage,
    EditProfilePage,
    PostDetailPage,
    UserProfilePage,
    TutorialPage,
    ChatsPage,
    StatusSwitcher,
    AvailabilityPage,
    ChattingPage,
    PassionsPage,
    PassionDetailPage,
    PassionItemsPage,
    PassionUsersPage,
    SettingsPage,
    TermsPage,
    PrivacyPage,
    ContactPage,
    FeedbackPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    MomentModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    HomePage,
    TabsPage,
    StartPage,
    LoginPage,
    RegisterMenuPage,
    RegisterPage,
    AddPostPage,
    EditProfilePage,
    PostDetailPage,
    UserProfilePage,
    TutorialPage,
    ChatsPage,
    AvailabilityPage,
    StatusSwitcher,
    ChattingPage,
    PassionsPage,
    PassionDetailPage,
    PassionItemsPage,
    PassionUsersPage,
    SettingsPage,
    TermsPage,
    PrivacyPage,
    ContactPage,
    FeedbackPage
  ],
  providers: [GlobalVars,InAppBrowser]
})
export class AppModule {}
