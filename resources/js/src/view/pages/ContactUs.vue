
<template>
    <b-container fluid class="main-container">
        <!-- Include PageLoader -->
        <!-- <PageLoader></PageLoader> -->
        <!-- Include Header -->
        <Header></Header>
        <b-container>
            <b-row align-h="center" align-v="center">
                <b-col cols="12">
                    <b-row align-h="center" align-v="center" class="my-md-20 my-sm-12" style="position: relative;">
                        <b-col cols="10">
                            <div class="ellipse-1"><img src="/media/custome/circle/ellipse-1.png" alt="circle-image" id="" class="circle-image-1" /></div>
                            <div class="ellipse-2"><img src="/media/custome/circle/ellipse-2.png" alt="circle-image" id="" class="circle-image-2" /></div>
                            <div class="ellipse-3"><img src="/media/custome/circle/ellipse-3.png" alt="circle-image" id="" class="circle-image-3" /></div>
                            <div class="my-md-12 my-sm-8">
                                <h2 class="section-title">Contact Us</h2>
                                <b-row align-h="center" align-v="center">
                                    <b-col cols="10" sm="8" md="8" lg="8" xl="8" xxl="8" class="mt-6 mt-md-8">
                                        <p class="section-text">We’re always here to assist you. Select the appropriate option below and let us help you with your inquiry.</p>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-col>

                        <b-col cols="10">
                            <div class="query-section my-8 my-sm-12 my-md-15" v-b-modal.show-query-modal>
                                <h2>Have a Dispute or Query? We’re Here to Help!</h2>
                                <b-row align-h="center" align-v="center">
                                    <b-col cols="12" sm="10" md="10" lg="10" xl="10" xxl="10" class="">
                                        <p>If you’re facing any issues or have a query regarding our services, we’re committed to resolving them quickly. When logged in, your details will be pre-filled, and a Ticket Number will be generated for tracking your request.</p>
                                    </b-col>
                                </b-row>
                            </div>
                            <!-- QUERY Modal start -->
                            <b-modal id="show-query-modal" :hide-footer="true">
                                <div class="d-flex flex-column-fluid flex-center">
                                    <div class="w-100">
                                        <div class="pb-15 pt-0 text-center">
                                            <h2>Fill in your Query Details</h2>
                                        </div>
                                        <form class="form">
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="query-name"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Name:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="query-name" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="queryName" ref="queryName" placeholder="Enter your name">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="query-emailId"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Email ID:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="query-emailId" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="email" name="queryEmailId" ref="queryEmailId" placeholder="Enter your Email ID">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="query-companyName"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Company Name:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="query-companyName" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="queryCompanyName" ref="queryCompanyName" placeholder="Enter your Company Name">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="query-userId"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>User ID:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="query-userId" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="queryUserId" ref="queryUserId" placeholder="Enter your User ID">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="query-ticketNumber"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Ticket Number:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="query-ticketNumber" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="queryTicketNumber" ref="queryTicketNumber" placeholder="Enter your Ticket Number">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="query-queryDescription"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Query Description:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-textarea id="query-queryDescription" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="queryQueryDescription" ref="queryQueryDescription" placeholder="Type your queries here"></b-form-textarea>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <div class="d-flex justify-content-center">
                                                <p class="text-center py-2" style="width: 60%;">Once submitted, you’ll receive a confirmation email with your <b>Ticket Number</b> to track your case.</p>
                                            </div>
                                        </form>
                                        <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12" class="my-5">
                                            <div class="d-flex flex-row justify-content-center">
                                                <b-button class="submit-btn">Submit</b-button>
                                            </div>
                                        </b-col>
                                    </div>
                                </div>
                            </b-modal>
                            <!-- QUERY Modal end -->
                        </b-col>

                        <b-col cols="10" class="quote-col">
                            <div class="quote-section my-8 my-sm-12 my-md-15" v-b-modal.show-quote-modal>
                                <h2>Get a Customized Quote Based on Your Needs</h2>
                                <b-row align-h="center" align-v="center">
                                    <b-col cols="12" sm="10" md="10" lg="10" xl="10" xxl="10" class="">
                                        <p>Looking for the best pricing option for your business? Fill in the details below, and we’ll provide a quote tailored to your needs.</p>
                                    </b-col>
                                </b-row>
                            </div>
                            <!-- QUOTE Modal start -->
                            <b-modal id="show-quote-modal" :hide-footer="true" ok-only>
                                <div class="d-flex flex-column-fluid flex-center">
                                    <div class="w-100">
                                        <div class="pb-15 pt-0 text-center">
                                            <h2>Fill in your Query Details</h2>
                                        </div>
                                        <form class="form" @submit.prevent="handleSubmit">
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="quote-quoteName"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Name:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="quote-quoteName" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="quoteName" ref="quoteName" placeholder="Enter your name">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="quote-companyEmailId"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Company Email ID:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="quote-companyEmailId" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="email" name="quoteCompanyEmailId" ref="quoteCompanyEmailId" placeholder="Enter your Email ID">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="quote-phoneNumber"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Phone Number:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="quote-phoneNumber" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="quotePhoneNumber" ref="quotePhoneNumber" placeholder="Enter your Phone Number">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="quote-designation"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Designation:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="quote-designation" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="quoteDesignation" ref="quoteDesignation" placeholder="Enter your Designation">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <!-- Select Box with Multiple Checkboxes -->
                                            <b-form-group id="fieldset-checkbox" label-cols-md="auto" label-for="quote-productOption" class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Product Chosen:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <!-- Custom Dropdown for Multiple Checkboxes -->
                                                        <b-form-select
                                                            class="form-control-sm"
                                                            v-model="selectedProductTypeOptions">
                                                            <option
                                                                v-for="(productTypeOption, index) in productTypeOptions" :key="index"
                                                                size="sm"
                                                                :value="productTypeOption.value"
                                                                :id="'checkbox-' + index"
                                                                >
                                                                {{ productTypeOption.text }}
                                                            </option>
                                                        </b-form-select>
                                                        <!-- {{ selectedOptions }} -->
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="quote-empNumber"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Number of Employees:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="quote-empNumber" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="quoteEmpNumber" ref="quoteEmpNumber" placeholder="Enter Number of Employees">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="quote-companyName"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 135px;">
                                                        <span>Company Name:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="quote-companyName" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="quoteCompanyName" ref="quoteCompanyName" placeholder="Enter your Company Name"></b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <div class="d-flex justify-content-center">
                                                <p class="text-center py-2" style="width: 60%;">Submit your details, and we’ll get back to you with a quote.</p>
                                            </div>
                                        </form>
                                        <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12" class="my-5">
                                            <div class="d-flex flex-row justify-content-center">
                                                <b-button type="submit" class="submit-btn">Submit</b-button>
                                            </div>
                                        </b-col>
                                    </div>
                                </div>
                            </b-modal>
                            <!-- QUOTE Modal end -->
                        </b-col>

                        <b-col cols="10" class="feedback-col">
                            <div class="feedback-section my-8 my-sm-12 my-md-15" v-b-modal.show-feedback-modal>
                                <h2>Feedback or Job Opportunities? Let’s Connect!</h2>
                                <b-row align-h="center" align-v="center">
                                    <b-col cols="12" sm="10" md="10" lg="10" xl="10" xxl="10" class="">
                                        <p>Share your feedback with us or let us know if you’re interested in joining our team. We appreciate your input!</p>
                                    </b-col>
                                </b-row>
                            </div>
                            <!-- FEEDBACK Modal start -->
                            <b-modal id="show-feedback-modal" :hide-footer="true">
                                <div class="d-flex flex-column-fluid flex-center">
                                    <div class="w-100">
                                        <div class="pb-15 pt-0 text-center">
                                            <h2>Fill in your Query Details</h2>
                                        </div>
                                        <form class="form">
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="feedback-name"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Name:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="feedback-name" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="feedbackName" ref="feedbackName" placeholder="Enter your name">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="feedback-emailId"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Email ID:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="feedback-emailId" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="email" name="feedbackEmailId" ref="feedbackEmailId" placeholder="Enter your Email ID">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="feedback-companyName"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Company Name:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-input id="feedback-companyName" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="feedbackCompanyName" ref="feedbackCompanyName" placeholder="Enter your Company Name">
                                                        </b-form-input>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto" label-for="feedback-productOption" class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Query Type:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-select
                                                            class="form-control-sm"
                                                            v-model="selectedQueryTypeOptions">
                                                            <option value="Feedback">Feedback</option>
                                                            <option value="Job enquiry">Job enquiry</option>
                                                        </b-form-select>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <b-form-group id="fieldset-horizontal" label-cols-md="auto"
                                                label-for="feedback-queryDescription"
                                                class="align-items-center">
                                                <template #label>
                                                    <div class="d-flex justify-content-end align-items-center label-label" style="width: 110px;">
                                                        <span>Query Description:</span>
                                                    </div>
                                                </template>
                                                <b-row>
                                                    <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12">
                                                        <b-form-textarea id="feedback-queryDescription" class="form-control form-control-solid h-auto py-4 px-2" 
                                                            type="text" name="feedbackQueryDescription" ref="feedbackQueryDescription" placeholder="Type your queries here"></b-form-textarea>
                                                    </b-col>
                                                </b-row>
                                            </b-form-group>
                                            <div class="d-flex justify-content-center">
                                                <p class="text-center py-2" style="width: 60%;">Once submitted, you’ll receive a confirmation email with your <b>Ticket Number</b> to track your case.</p>
                                            </div>
                                        </form>
                                        <b-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" xxl="12" class="my-5">
                                            <div class="d-flex flex-row justify-content-center">
                                                <b-button class="submit-btn">Submit</b-button>
                                            </div>
                                        </b-col>
                                    </div>
                                </div>
                            </b-modal>
                            <!-- FEEDBACK Modal end -->
                        </b-col>

                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </b-container>
</template>
<script>
    import Header from "@/view/layout/Header.vue";
    import ApiService from "@/core/services/api.service";
    // import PageLoader from '../components/PageLoader.vue';
    export default {
        data() {
            return {
                productTypeOptions: [
                    { value: 'Focus Air', text: 'Focus Air' },
                    { value: 'Focus Sea', text: 'Focus Sea' },
                    { value: 'Focus Road', text: 'Focus Road' }
                ],
                selectedProductTypeOptions: [],
                selectedQueryTypeOptions: []
            };
        },
        components: {
            Header,
            // PageLoader
        },
    };
</script>

<style scoped>

@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

html, body, html * {
  font-family: 'Roboto', sans-serif !important;
}
.main-container {
    background: linear-gradient(180deg, #EDF7FF 10%, #FFFFFF 38%);
}
.section-title {
    font-size: 48px !important;
    font-weight: 500;
    line-height: 54px !important;
    text-align: center;
    color: #355594;
}
.section-text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color:#4C4C4C;
}
.ellipse-1 {
    position: absolute;
    left: 93%;
    top: -20%;
}
.circle-image-1 {
    width: 60px;
    height: auto;
}
.ellipse-2 {
    position: absolute;
    left: 5%;
    top: 57%;
}
.circle-image-2 {
    width: 10px;
    height: auto;
}
.ellipse-3 {
    position: absolute;
    left: -3%;
    top: 100%;
}
.circle-image-3 {
    width: 25px;
    height: auto;
}
.query-section,
.quote-section,
.feedback-section {
    padding: 78px 186px;
    border-radius: 30px;
    background: #FFFFFF;
    box-shadow: 4px 4px 80px 5px #0000001A;
}
.query-section h2,
.quote-section h2,
.feedback-section h2 {
    font-size: 40px;
    font-weight: 500;
    line-height: 45px;
    text-align: center;
    color: #355594;
    margin: 0;
    padding-bottom: 30px;
}
.query-section p,
.quote-section p,
.feedback-section p {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: #4C4C4C;
    margin: 0;
    padding-top: 30px;
}
.query-section:hover,
.quote-section:hover,
.feedback-section:hover {
    background: linear-gradient(180deg, #E8F6FF 0%, #FFFFFF 100%);
    box-shadow: 4px 4px 80px 5px #0000001A;
    transition: all 0.3s ease;
    cursor: pointer;
}

#show-query-modal h2,
#show-quote-modal h2,
#show-feedback-modal h2 {
    font-size: 24px;
    font-weight: 500;
    line-height: 30px;
    text-align: center;
    color: #355594;
    margin: 0;
}
.submit-btn {
    background: transparent !important;
    border: 1px solid #A6A6A6;
    color: #A6A6A6;
    border-radius: 30px;
    padding: 8px 20px;
}
.submit-btn:hover {
    background: transparent !important;
    border: 1px solid #A6A6A6 !important;
    color: #A6A6A6 !important;
    box-shadow: 1px 0px 4px 0px #00000040;
}
/* For Extra Small Screens (xs - <576px) */
@media (max-width: 575px) {
    .section-title {
        font-size: 36px !important;
        line-height: 40px !important;
    }
    .query-section,
    .quote-section,
    .feedback-section {
        padding: 20px;
    }
    .query-section h2,
    .quote-section h2,
    .feedback-section h2 {
        font-size: 22px;
        line-height: 28px;
        padding-bottom: 10px;
    }
    .query-section p,
    .quote-section p,
    .feedback-section p {
        font-size: 13px;
        line-height: 20px;
        padding-top: 10px;
    }
    .label-label {
        width: auto !important;
        justify-content: start !important;
    }
}
@media (max-width: 575px) {
    .section-title {
        font-size: 40px !important;
        line-height: 46px !important;
    }
    .section-text {
        font-size: 12px;
        line-height: 18px;
    }
    .circle-image-1 {
        width: 30px;
        height: auto;
    }
    .ellipse-2 {
        top: 56%;
        left: 4%;
    }
    .ellipse-3 {
        top: 95%;
        left: -5%;
    }
}
/* For Small Screens (sm - ≥576px) */
@media (min-width: 576px) and (max-width: 767px) {
    .section-title {
        font-size: 44px !important;
        line-height: 50px !important;
    }
    .section-text {
        font-size: 12px;
        line-height: 18px;
    }
    .circle-image-1 {
        width: 45px;
        height: auto;
    }
    .query-section,
    .quote-section,
    .feedback-section {
        padding: 30px;
    }
    .query-section h2,
    .quote-section h2,
    .feedback-section h2 {
        font-size: 28px;
        line-height: 34px;
        padding-bottom: 10px;
    }
    .query-section p,
    .quote-section p,
    .feedback-section p {
        font-size: 13px;
        line-height: 20px;
        padding-top: 10px;
    }
    .label-label {
        width: auto !important;
        justify-content: start !important;
    }
}

/* For Medium Screens (md - ≥768px) */
@media (min-width: 768px) and (max-width: 991px) {
    .query-section,
    .quote-section,
    .feedback-section {
        padding: 50px;
    }
    .query-section h2,
    .quote-section h2,
    .feedback-section h2 {
        font-size: 34px;
        line-height: 40px;
        padding-bottom: 12px;
    }
    .query-section p,
    .quote-section p,
    .feedback-section p {
        font-size: 13px;
        line-height: 20px;
        padding-top: 12px;
    }
}

/* For Large Screens (lg - ≥992px) */
@media (min-width: 992px) and (max-width: 1199px) {
    .query-section,
    .quote-section,
    .feedback-section {
        padding: 60px 80px;

    }
}

/* For Extra Large Screens (xl - ≥1200px) */
/* @media (min-width: 1200px) {
    
} */
</style>

<style>
/* Model box css */
.modal-content {
    background-color: #F3F6F9 !important;
    backdrop-filter: blur(130px) !important;
    box-shadow: 5px 4px 25px 0px #0000001F !important;
    border-radius: 40px !important;
    padding: 2.5rem;
}
.modal-body {
    padding: 0px !important;
}
.modal .modal-header {
    border: 0px !important;
}
.close {
    font-size: 3rem !important;
    font-weight: 300 !important;
}
.modal .modal-header .close:hover {
    color: #355594 !important;
}
.form-control, .form-control-solid {
    background: transparent !important;
    border: 1px solid #A6A6A6 !important;
}
.form-control-solid:active {
    background-color: #f3f6f9 !important;
}
#quote-productOptions .btn {
    background: transparent !important;
    border: 1px solid #A6A6A6 !important;
    text-align: left !important;
}
.custom-select {
    background-color: transparent !important;
    border-color: #a6a6a6 !important;
}

@media (min-width: 576px) {
    .modal-dialog {
        max-width: 600px !important;
    }
}
</style>