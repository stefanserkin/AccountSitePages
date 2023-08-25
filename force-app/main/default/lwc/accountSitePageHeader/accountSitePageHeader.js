import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import IMAGE_URL_FIELD from '@salesforce/schema/Account_Site_Page__c.Header_Image_URL__c';

export default class AccountSitePageHeader extends LightningElement {
    @api recordId;

    imageUrl;

    @wire(getRecord, { 
        recordId: "$recordId", 
        fields: [IMAGE_URL_FIELD] 
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
            console.log(data);
            this.imageUrl = data.fields.Header_Image_URL__c.value;
            console.log('imageUrl --> ', this.imageUrl);
        }
    }

}