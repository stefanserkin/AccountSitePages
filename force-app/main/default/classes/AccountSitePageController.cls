public with sharing class AccountSitePageController {
    
    /**
     * Get resources associated with a site page
     */
    @AuraEnabled(cacheable=true)
    public static List<Site_Page_Resource__c> getSitePageResources(String recordId) {
        try {
            return [
                SELECT Id, Name, Resource_URL__c, Sort_Order__c, Open_Link_in_New_Tab__c
                  FROM Site_Page_Resource__c
                 WHERE Account_Site_Page__c = :recordId
                 ORDER BY Sort_Order__c ASC NULLS LAST
                 LIMIT 20
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * TODO - Perform any validation against data in the database
     */
    @AuraEnabled(cacheable=false)
    public static Boolean isUserEligible() {
        return true;
    }

    /**
     * TODO - Perform any validation against data in the database
     */
    @AuraEnabled(cacheable=false)
    public static String createGuestPass() {
        String result = 'success';
        return result;
    }

}