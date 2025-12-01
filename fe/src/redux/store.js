import { configureStore } from "@reduxjs/toolkit";
import choosenAccountSlice from "./AccountSlice/choosenAccountSlice";
import listAccountSlice from "./AccountSlice/listAccountSlice";
import modalSlice from "./modalSlice";
import choosenPatientSlice from "./PatienSlice/choosenPatientSlice";
import listPatientSlice from "./PatienSlice/listPatientSlice";


import choosenLaboSlice from "./LaboSlice/choosenLaboSlice";
import listLaboSlice from "./LaboSlice/listLaboSlice";

import choosenMaterialSlice from "./MaterialSlice/choosenMaterialSlice";
import listMaterialSlice from "./MaterialSlice/listMaterialSlice";


import choosenMaterialImportSlice from "./MaterialSlice/choosenMaterialImportSlice";
import listmaterialImportSlice from "./MaterialSlice/listMaterialImportSlice";


import choosenMaterialExportSlice from "./MaterialSlice/choosenMaterialExportSlice";
import listMaterialExportSlice from "./MaterialSlice/listMaterialExportSlice";

import userProfileSlice from "./ProfileSlice/userProfileSlice";



import listIncomeSlice from "./IncomeSlice/listIncomeSlice";

import listCategorySlice from "./ServiceAndCategorySlice/listCategorySlice";

import choosenServiceSlice from "./ServiceAndCategorySlice/choosenServiceSlice";

import listBillSlice from "./BillSlice/listBillSlice";
import choosenBillSlice from "./BillSlice/choosenBillSlice";

import listSpecimensSlice from "./SpecimensSlice/listSpecimensSlice";
import choosenSpecimensSlice from "./SpecimensSlice/choosenSpecimensSlice";
import listRecordSlice from "./RecordSlice/listRecordSlice";

import listReceiptSlice from "./ReceiptSlice/listReceiptSlice";
import choosenNewReceiptSlice from "./ReceiptSlice/choosenNewReceiptSlice";
import listWaitingSlice from "./WaitingSlice/listWaitingSlice";
import listConfirmWaitingSlice from "./WaitingSlice/listConfirmWaitingSlice";

import listSpecimenSlice from "./SpecimenSlice/listSpecimenSlice";
import choosenSpecimenSlice from "./SpecimenSlice/choosenSpecimenSlice";

import listScheduleSlice from "./ScheduleSlice/listScheduleSlice";




const store = configureStore({
    reducer: {
        listAccount: listAccountSlice,
        modal: modalSlice,
        choosenAccount: choosenAccountSlice,
        listPatient: listPatientSlice,
        choosenPatient: choosenPatientSlice,

        choosenMaterial: choosenMaterialSlice,
        listMaterial: listMaterialSlice,

        choosenMaterialImport: choosenMaterialImportSlice,
        listMaterialImport: listmaterialImportSlice,

        choosenMaterialExport: choosenMaterialExportSlice,
        listMaterialExport: listMaterialExportSlice,


        choosenLabo: choosenLaboSlice,
        listLabo: listLaboSlice,
        choosenSpecimens: choosenSpecimensSlice,
        listSpecimens: listSpecimensSlice,



        listIncome: listIncomeSlice,
        listBill: listBillSlice,
        choosenBill: choosenBillSlice,

        listCategory: listCategorySlice,
        choosenService: choosenServiceSlice,
        listRecord: listRecordSlice,

        listReceipts: listReceiptSlice,
        choosenNewReceipt: choosenNewReceiptSlice,

        listWaiting: listWaitingSlice,
        listConfirmWaiting: listConfirmWaitingSlice,

        userProfile: userProfileSlice,

        listSpecimen: listSpecimenSlice,
        choosenSpecimen: choosenSpecimenSlice,

        listSchedule: listScheduleSlice,
    }
})

export default store;