import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Pagination, Typography, IconButton, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryServicedId } from "../../../redux/modalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { listAllCategoryAPI } from "../../../config/baseAPI";
import axiosInstance from "../../../config/customAxios";
import {
  deleteCategory,
  deleteService,
  fetchAllServiceByCategory,
  setIsAddCategory,
  setIsDeleteCategory,
  setIsUpdateCategory,
} from "../../../redux/ServiceAndCategorySlice/listCategorySlice";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
// import ModalUpdateMaterialImport from '../../ModalComponent/ModalMaterial/ModalUpdateMaterialImport';
import ModalAddCategory from "../../ModalComponent/ModalCategory/ModalAddCategory";
import ModalUpdateCategory from "../../ModalComponent/ModalCategory/ModalUpdateCategory";

import ModalDeleteService from "../../ModalComponent/ModalService/ModalDeleteService";
import ModalAddService from "../../ModalComponent/ModalService/ModalAddService";
import ModalUpdateService from "../../ModalComponent/ModalService/ModalUpdateService";
import { setServicedId } from "../../../redux/modalSlice";
import {
  StyledTableCell,
  StyledTableRow,
  StyledTable,
} from "../../ui/TableElements";
import InputDentist from "../../ui/input";
import Loading from "../../ui/Loading";
import { Modal, Skeleton } from "antd";

const color = {
  border: "rgba(0, 0, 0, 0.2)",
};

const ServiceAndCategoryManagementContent = () => {
  const listCategory = useSelector((state) => state.listCategory.listCategory);
  const listServiceByCategory = useSelector(
    (state) => state.listCategory.listServiceByCategory
  );
  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.pageSize);
  const totalPages = useSelector((state) => state.totalPage);
  const [currentPage, setCurrentPage] = useState(0);

  const isUpdateCategory = useSelector(
    (state) => state.listCategory.isUpdateCategory
  );
  const isDeleteService = useSelector(
    (state) => state.listCategory.isDeleteService
  );
  const isAddCategory = useSelector(
    (state) => state.listCategory.isAddCategory
  );
  const isDeleteCategory = useSelector(
    (state) => state.listCategory.isDeleteCategory
  );
  const isAddService = useSelector((state) => state.listCategory.isAddService);
  const isUpdateService = useSelector(
    (state) => state.listCategory.isUpdateService
  );

  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalDeleteCategoryOpen, setModalDeleteCategoryOpen] = useState(false);
  const [modalAddCategoryOpen, setModalAddCategoryOpen] = useState(false);
  const [modalAddServiceOpen, setModalAddServiceOpen] = useState(false);
  const [modalUpdateServiceOpen, setModalUpdateServiceOpen] = useState(false);
  const id = useSelector((state) => state.listCategory.id);
  const loading = useSelector((state) => state.listCategory.loading);
  // const [loading, setLoading] = useState();

  const [originData, setOriginData] = useState([]);
  const [categoryServiceIds, setCategoryServiceIds] = useState([]);
  const [categoryServiceId, setCategoryServiceId] = useState();

  const [serviceIds, setServiceIds] = useState([]);
  const [isSubmitFormService, setIsSubmitFormService] = useState(false);

  // const [serviceId, setServiceId] = useState();
  // const [categoryId, setCategoryId] = useState();
  // const [categorySelected, setCategorySelected] = useState();
  const [searchCategory, setSearchCategory] = useState("");

  const loadCategory = async () => {
    try {
      const res = await axiosInstance.get(listAllCategoryAPI);
      setCategoryServiceId(res.data[0].categoryServiceId);
      setOriginData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const loadCategoryNotChangeId = async () => {
    try {
      const res = await axiosInstance.get(listAllCategoryAPI);
      setOriginData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  useEffect(() => {
    if (isAddCategory || isUpdateCategory || isDeleteCategory) {
      if (isDeleteCategory) {
        loadCategory();
      } else {
        loadCategoryNotChangeId();
      }
      dispatch(setIsAddCategory(false));
      dispatch(setIsUpdateCategory(false));
      dispatch(setIsDeleteCategory(false));
    }
  }, [isAddCategory, isUpdateCategory, isDeleteCategory]);

  useEffect(() => {
    if (originData.length) {
      setCategoryServiceIds(
        originData.filter(
          (item) =>
            item?.categoryServiceName
              .toUpperCase()
              .indexOf(searchCategory.toUpperCase()) !== -1
        )
      );
    }
  }, [searchCategory, originData]);

  const loadServiceByCategoryId = async (categoryServiceId) => {
    try {
      dispatch(fetchAllServiceByCategory(categoryServiceId));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setServiceIds(listServiceByCategory);
  }, [listServiceByCategory]);

  useEffect(() => {
    if (categoryServiceId) {
      loadServiceByCategoryId(categoryServiceId);
    }
  }, [categoryServiceId]);

  useEffect(() => {
    if (isDeleteService || isAddService || isUpdateService) {
      loadServiceByCategoryId(categoryServiceId);
    }
  }, [isDeleteService, isAddService, isUpdateService]);

  return (
    <>
      {loading && <Loading />}
      <h2 className="font-bold mb-2"> Dịch Vụ Nha Khoa</h2>
      <div className="flex gap-3 justify-end mb-3">
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            setModalUpdateOpen(true);
            dispatch(setCategoryServicedId(categoryServiceId));
          }}
        >
          <span className="leading-none">Cập nhật loại dịch vụ</span>
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setModalAddServiceOpen(true);
          }}
        >
          <span className="leading-none">Thêm mới dịch vụ</span>
        </Button>
        <Button
          variant="contained"
          color="error"
          endIcon={<DeleteIcon />}
          onClick={() => setModalDeleteCategoryOpen(true)}
        >
          <span className="leading-none">Xóa loại dịch vụ</span>
        </Button>
      </div>
      <Box className="flex gap-3">
        <div>
          <Box className="bg-white p-4 rounded-lg shadow-md mb-3">
            <InputDentist
              id="labo"
              label="Tìm Dịch Vụ"
              value={searchCategory}
              onChange={(e) => {
                setSearchCategory(e.target.value);
              }}
            />
          </Box>
          <Box className="bg-white py-4 rounded-lg shadow-md text-center w-[300px]">
            <p className="font-bold text-center">
              Có ( {categoryServiceIds.length} ) kết quả
            </p>
            {categoryServiceIds.length ? (
              <div className="flex flex-col gap-2 px-3 max-h-[515px] overflow-y-scroll overflow-x-hidden text-left">
                {categoryServiceIds.map((item, index) => (
                  <Box
                    className={`whitespace-nowrap p-2 rounded-md cursor-pointer hover:bg-slate-100 ${
                      categoryServiceId === item.categoryServiceId &&
                      "bg-sky-100 text-sky-600"
                    }`}
                    onClick={() => {
                      setCategoryServiceId(item.categoryServiceId);
                    }}
                  >
                    {item.categoryServiceName}
                  </Box>
                ))}
              </div>
            ) : (
              <Box className="px-3">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Box>
            )}
            <Button
              color="success"
              className="fixed bottom-0 top-3"
              onClick={() => {
                setModalAddCategoryOpen(true);
              }}
            >
              Thêm loại dịch vụ
            </Button>
          </Box>
        </div>
        <Box className="w-full text-center">
          <StyledTable className="shadow-md text-center" size="small">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Dịch vụ
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Đơn vị
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Giá trên thị trường
                </StyledTableCell>
                <StyledTableCell style={{ fontWeight: "bold" }}>
                  Giá tại nha khoa Nguyễn Trần
                </StyledTableCell>
                <StyledTableCell />
              </StyledTableRow>
            </TableHead>
            <TableBody size="medium">
              {serviceIds?.map((item, index) => (
                <StyledTableRow
                  style={{ textAlign: "center" }}
                  key={item.serviceId}
                  size="medium"
                >
                  <StyledTableCell size="medium">
                    {item.serviceName}
                  </StyledTableCell>
                  <StyledTableCell>{item.unit}</StyledTableCell>
                  <StyledTableCell>{item.marketPrice}</StyledTableCell>
                  <StyledTableCell>{item.price}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setModalDeleteOpen(true);
                        dispatch(setServicedId(item.serviceId));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        dispatch(setServicedId(item.serviceId));
                        setModalUpdateServiceOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </Box>
      </Box>

      <div>
        <ModalUpdateCategory
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
        />
      </div>

      <div>
        <ModalUpdateService
          modalUpdateOpen={modalUpdateServiceOpen}
          setModalUpdateOpen={setModalUpdateServiceOpen}
          isSubmitForm={setIsSubmitFormService}
        />
      </div>
      <div>
        <ModalDeleteService
          modalDeleteOpen={modalDeleteOpen}
          setModalDeleteOpen={setModalDeleteOpen}
          isSubmitForm={setIsSubmitFormService}
        />
      </div>
      <div>
        <ModalAddCategory
          modalAddCategoryOpen={modalAddCategoryOpen}
          setModalAddCategoryOpen={setModalAddCategoryOpen}
        />
      </div>

      <div>
        <ModalAddService
          listCategoryService={categoryServiceIds}
          categoryServiceId={categoryServiceId}
          modalAddOpen={modalAddServiceOpen}
          setModalAddOpen={setModalAddServiceOpen}
          isSubmitForm={setIsSubmitFormService}
        />
      </div>
      <Modal
        title="Thông báo"
        open={modalDeleteCategoryOpen}
        onOk={() => {
          setModalDeleteCategoryOpen(false);
          dispatch(deleteCategory(categoryServiceId));
        }}
        confirmLoading={loading}
        onCancel={() => setModalDeleteCategoryOpen(false)}
      >
        <p>Chắc chắn xóa dịch vụ này</p>
      </Modal>
    </>
  );
};

export default ServiceAndCategoryManagementContent;
