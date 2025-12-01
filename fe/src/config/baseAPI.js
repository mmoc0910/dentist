export const baseUrl = process.env.REACT_APP_BASE_URL

export const listUserAPI = `${baseUrl}/api/users/get_list_users`
export const getAccountByIdAPI = `${baseUrl}/api/users/`
export const updateAccountAPI = `${baseUrl}/api/users/`
export const deleteAccountAPI = `${baseUrl}/api/users/`
export const addAccountAPI = `${baseUrl}/api/users/register`

export const listPatientAPI = `${baseUrl}/api/patients/get_list_patients`
export const getPatientByIdAPI = `${baseUrl}/api/patients/`
export const addPatientAPI = `${baseUrl}/api/patients/`
export const deletePatientAPI = `${baseUrl}/api/patients/`
export const updatePatientAPI = `${baseUrl}/api/patients/`
export const searchPatientAPI = `${baseUrl}/api/patients/get_list_patients?`

export const listRoleAPI = `${baseUrl}/api/roles/get_list_roles`



export const listLaboAPI = `${baseUrl}/api/labos/get_list_labos`
export const getLaboByIdAPI = `${baseUrl}/api/labos/`
export const getListPrepareByIdAPI = `${baseUrl}/api/labos/get_list_prepare/`
export const updatePrepareAPI = `${baseUrl}/api/specimens/labo_receive`
export const updateReceiveAPI = `${baseUrl}/api/specimens/labo_delivery`
export const getListReceiveByIdAPI = `${baseUrl}/api/labos/get_list_receive/`
export const updateLaboAPI = `${baseUrl}/api/labos/`
export const deleteLaboAPI = `${baseUrl}/api/labos/`
export const addLaboAPI = `${baseUrl}/api/labos/`

export const getSpecimensByIdAPI = `${baseUrl}/api/specimens/`
export const patientSpecimenAPI = `${baseUrl}/api/specimens/get_list_specimens_of_patient/`
export const addSpecimensAPI = `${baseUrl}/api/specimens/`
export const updateSpecimensAPI = `${baseUrl}/api/specimens/`
export const deleteSpecimensAPI = `${baseUrl}/api/specimens/`

export const listMaterialAPI = `${baseUrl}/api/materials/get_list_materials`
export const listAllMaterialAPI = `${baseUrl}/api/materials/get_all_material`
export const getMaterialByIdAPI = `${baseUrl}/api/materials/`
export const updateMaterialAPI = `${baseUrl}/api/materials/`
export const deleteMaterialAPI = `${baseUrl}/api/materials/`
export const addMaterialAPI = `${baseUrl}/api/materials/`


export const listMaterialImportAPI = `${baseUrl}/api/material_imports/get_list_import`
export const getMaterialImportByIdAPI = `${baseUrl}/api/material_imports/`
export const updateMaterialImportAPI = `${baseUrl}/api/material_imports/`
export const deleteMaterialImportAPI = `${baseUrl}/api/material_imports/`
export const addMaterialImportAPI = `${baseUrl}/api/material_imports/`
export const addListMaterialImportAPI = `${baseUrl}/api/material_imports/add_list_import/`

export const listServiceAndCategoryAPI = `${baseUrl}/api/categories/get_list_service`

export const listMaterialExportAPI = `${baseUrl}/api/material_export/get_list_export`
export const patientMaterialExportAPI = `${baseUrl}/api/material_export/get_list_material_export_of_patient/`
export const getMaterialExportByIdAPI = `${baseUrl}/api/material_export/`
export const updateMaterialExportAPI = `${baseUrl}/api/material_export/`
export const addMaterialExportAPI = `${baseUrl}/api/material_export/`
export const deleteMaterialExportAPI = `${baseUrl}/api/material_export/`

export const listAllPatientAPI = `${baseUrl}/api/patients/get_all_patients`
export const listPatientRecordByTreatmentIdAPI = `${baseUrl}/api/patient_record/get_all_record/`
export const allPatientRecordAPI = `${baseUrl}/api/patient_record/get_list_record/`
export const patientRecordAPI = `${baseUrl}/api/patient_record/`
export const addRecordAPI = `${baseUrl}/api/patient_record/`
export const deleteRecordAPI = `${baseUrl}/api/patient_record/`
export const updateRecordAPI = `${baseUrl}/api/patient_record/`

export const loginAPI = `${baseUrl}/api/login`
export const forgotPassword = `${baseUrl}/api/forgot_password?username=`
export const profileAPI = `${baseUrl}/api/users/get_profile`
export const changePasswordAPI = `${baseUrl}/api/users/change_password/`
export const GET_LIST_TIMEKEEPING = `${baseUrl}/api/timekeeping/get_list_timekeeping?size=10&page=`
export const CHECK_IN = `${baseUrl}/api/timekeeping/checkin`
export const CHECK_OUT = `${baseUrl}/api/timekeeping/checkout`

export const listAllCategoryAPI = `${baseUrl}/api/categories/get_all_category_service`

export const addCategoryAPI = `${baseUrl}/api/categories/`
export const getCategoryByIdAPI = `${baseUrl}/api/categories/`
export const updateCategoryBySelectIdAPI = `${baseUrl}/api/categories/`
export const deleteCategoryBySelectIdAPI = `${baseUrl}/api/categories/`


export const listServiceByCategoryIdAPI = `${baseUrl}/api/categories/get_all_service_by_category_id/`
export const listServiceAPI =  `${baseUrl}/api/categories/get_all_service`
export const getServiceByIdAPI = `${baseUrl}/api/categories/get_detail_service/`
export const deleteServiceAPI = `${baseUrl}/api/categories/delete_service/`
export const addServiceAPI = `${baseUrl}/api/categories/add_service`
export const updateServiceAPI = `${baseUrl}/api/categories/update_service/`


export const listIncomeAPI = `${baseUrl}/api/income`

export const listBillAPI = `${baseUrl}/api/bills/get_list_bills`
export const getBillByIdAPI = `${baseUrl}/api/bills/`
export const getListReceiptsByIdAPI = `${baseUrl}/api/receipts/get_list_receipts_by_treatment/`
export const getNewReceiptByIdAPI = `${baseUrl}/api/receipts/new_receipts/`
export const addNewReceiptByIdAPI = `${baseUrl}/api/receipts/`

export const listNetIncomeAPI = `${baseUrl}/api/income/net_income`
export const listTotalSpendIncomeAPI = `${baseUrl}/api/income/total_spend`


export const listTreatingServiceAPI = `${baseUrl}/api/categories/get_treating_service/`
export const listAllServiceAPI = `${baseUrl}/api/categories/get_all_service`

export const listWaitingAPI = `${baseUrl}/api/waiting_room/get-list-waiting`
export const listConfirmWaitingAPI = `${baseUrl}/api/waiting_room/get_list_confirm`
export const deleteWaitingAPI = `${baseUrl}/api/waiting_room/`
export const callWaitingAPI = `${baseUrl}/api/waiting_room/call-patient/`
export const confirmWaitingAPI = `${baseUrl}/api/waiting_room/confirm-customer/`

export const listSpecimenAPI = `${baseUrl}/api/specimens/get_list_speciemns`
//------ thừa----
export const addSpecimenAPI = `${baseUrl}/api/specimens/get_list_speciemns`
export const updateSpecimenAPI = `${baseUrl}/api/specimens/get_list_speciemns`
export const deleteSpecimenAPI = `${baseUrl}/api/specimens/get_list_speciemns`
//--------------
export const searchSpecimenAPI = `${baseUrl}/api/specimens/get_list_speciemns`
export const getSpecimenByIdAPI = `${baseUrl}/api/specimens/`
export const reportSpecimenAPI = `${baseUrl}/api/specimens/report_specimen/`
export const useSpecimenAPI = `${baseUrl}/api/specimens/use_specimen/`

export const getAllLaboAPI = `${baseUrl}/api/labos/get_all_labo`


export const getListScheduleAPI = `${baseUrl}/api/schedule/get_list_schedule`
export const getScheduleByIdAPI = `${baseUrl}/api/schedule/`
export const addScheduleAPI = `${baseUrl}/api/schedule`
export const updateScheduleAPI = `${baseUrl}/api/schedule/`
export const getListNotifiesAPI = `${baseUrl}/api/notifies/get_list_notify`
export const readNotiAPI = `${baseUrl}/api/notifies/read_notify/`




