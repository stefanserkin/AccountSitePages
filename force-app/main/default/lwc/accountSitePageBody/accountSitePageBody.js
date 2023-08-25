import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getSitePageResources from '@salesforce/apex/AccountSitePageController.getSitePageResources';
import NAME_FIELD from '@salesforce/schema/Account_Site_Page__c.Name';
import ACTIVE_FIELD from '@salesforce/schema/Account_Site_Page__c.Active__c';
import SHOW_FILES_FIELD from '@salesforce/schema/Account_Site_Page__c.Show_Public_Files__c';
import SHOW_GUESTPASSES_FIELD from '@salesforce/schema/Account_Site_Page__c.Show_Guest_Pass_Form__c';
import BODY_CONTENT_FIELD from '@salesforce/schema/Account_Site_Page__c.Body_Content__c';
import HEADER_IMAGE_FIELD from '@salesforce/schema/Account_Site_Page__c.Header_Image_URL__c';

import LEAD_OBJECT from '@salesforce/schema/Lead';
import SOURCE_FIELD from '@salesforce/schema/Lead.LeadSource';
import STATUS_FIELD from '@salesforce/schema/Lead.Status';
import FIRSTNAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Lead.LastName';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';

const FIELDS = [
    NAME_FIELD,
    ACTIVE_FIELD,
    SHOW_FILES_FIELD,
    SHOW_GUESTPASSES_FIELD,
    BODY_CONTENT_FIELD,
    HEADER_IMAGE_FIELD
];

export default class AccountSitePageBody extends LightningElement {
    @api recordId;
    isLoading = false;
    error;

    // Account site page settings
    accountSitePage;
    pageName;
    isActivePage = false;
    showPublicFiles = false;
    showGuestPassForm = false;
    bodyContent;
    headerImageUrl;
    wiredResources = [];
    resources;

    // User info
    firstName;
    lastName;
    email;
    phone;

    /**
     * Get account site page record with page settings/controls
     */
    @wire(getRecord, { 
        recordId: "$recordId", 
        fields: FIELDS 
    })wiredRecord({ error, data }) {
        if (error) {
            console.error(error);
            let message = "Unknown error";
            if (Array.isArray(error.body)) {
                message = error.body.map((e) => e.message).join(", ");
            } else if (typeof error.body.message === "string") {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                title: "Error loading contact",
                message,
                variant: "error",
                }),
            );
        } else if (data) {
            this.accountSitePage = data;
            this.pageName = this.accountSitePage.fields.Name.value;
            this.isActivePage = this.accountSitePage.fields.Active__c.value;
            this.showPublicFiles = this.accountSitePage.fields.Show_Public_Files__c.value;
            this.showGuestPassForm = this.accountSitePage.fields.Show_Guest_Pass_Form__c.value;
            this.bodyContent = this.accountSitePage.fields.Body_Content__c.value;
            this.headerImageUrl = this.accountSitePage.fields.Header_Image_URL__c.value;
        }
    }

    /**
     * Wire related resources set for public display
     */
    @wire(getSitePageResources, { recordId: '$recordId' })
    wiredResult(result) {
        this.isLoading = true;
        this.wiredResources = result;
        if (result.data) {
            let rows = JSON.parse( JSON.stringify(result.data) );
            rows.forEach(row => {
                row.targetBehavior = row.Open_Link_in_New_Tab__c ? '_blank' : '_self';
            });
            this.resources = rows;
            this.error = undefined;
            this.isLoading = false;
        } else if (result.error) {
            console.error(result.error);
            this.resources = undefined;
            this.error = result.error;
            this.isLoading = false;
        }
    }

    /**
     * Handle guest pass form input
     */

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleFormSubmission() {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputFields) => {
                inputFields.reportValidity();
                return validSoFar && inputFields.checkValidity();
            }, true);

        if (allValid) {
            const fields = {};
            fields[SOURCE_FIELD.fieldApiName] = 'Affiliation Partnership';
            fields[STATUS_FIELD.fieldApiName] = 'New - Not Contacted';
            fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;
            fields[LASTNAME_FIELD.fieldApiName] = this.lastName;
            fields[EMAIL_FIELD.fieldApiName] = this.email;
            fields[PHONE_FIELD.fieldApiName] = this.phone;
            fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;
            fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;

            const recordInput = {
                apiName: LEAD_OBJECT.objectApiName,
                fields
            };
        }
    }


    /**
     * Handle resource library actions
     */

    handleGoToResource(event) {
        const curResource = event.currentTarget.dataset;
        window.open(curResource.url, curResource.targetBehavior);
    }

}