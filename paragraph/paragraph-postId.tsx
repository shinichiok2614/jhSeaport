import React, { useState, useEffect, useRef } from "react";
import {
  json,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Button,
  Table,
  Row,
  Col,
  Form,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  Translate,
  TextFormat,
  getSortState,
  translate,
  isNumber,
  ValidatedBlobField,
} from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
// import { APP_DATE_FORMAT } from 'app/config/constants';
// import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from "app/shared/util/entity-utils";
import {
  convertDateTimeFromServer,
  convertDateTimeToServer,
} from "app/shared/util/date-utils";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { ValidatedField, ValidatedForm } from "react-jhipster";

import {
  createEntity,
  deleteEntity,
  getEntitiesByPostId,
  getEntity,
  reset,
  updateEntity,
} from "./paragraph.reducer";
import {
  getEntitiesByParagraphId,
  getEntitiesByPostId as getImagesByPostId,
} from "../image/image.reducer";
import {
  getEntity as getPostById,
  increaseView,
} from "app/entities/post/post.reducer";
import {
  getEntity as getImageId,
  updateEntity as updateEntityImage,
  createEntity as createEntityImage,
  deleteEntity as deleteImageEntity,
} from "app/entities/image/image.reducer";

import "./paragraph-postId.scss";
import DeleteConfirmationButtons from "./DeleteConfirmationButtons";

export const ParagraphPostId = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>(); // Lấy postId từ URL

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(
    overrideSortStateWithQueryParams(
      getSortState(pageLocation, "id"),
      pageLocation.search
    )
  );
  const [editParagraph, setEditParagraph] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditParagraph, setIsEditParagraph] = useState(false);
  const [isEditImage, setIsEditImage] = useState(false);
  const [paragraphToDelete, setParagraphToDelete] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);

  const paragraphList = useAppSelector((state) => state.paragraph.entities);
  const imageList = useAppSelector((state) => state.image.entities);
  const loading = useAppSelector((state) => state.paragraph.loading);
  const updating = useAppSelector((state) => state.paragraph.updating);
  const postEntity = useAppSelector((state) => state.post.entity);

  const isNew = !editParagraph || !editParagraph.id;
  const isNewImage = !editImage || !editImage.id;

  //trong image-update dùng id url để biết create hay update nên dùng biến isNew lấy id
  //file dùng redux nên không dùng được cách trên
  //còn create image thôi

  useEffect(() => {
    dispatch(getPostById(id));
  }, []);

  // useEffect(() => {
  //   if (id) {
  //     dispatch(getEntitiesByPostId({ postId: parseInt(id, 10) }));
  //     dispatch(getImagesByPostId({ id: parseInt(id, 10) }));
  //   }
  // }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(increaseView(parseInt(id, 10)));
      dispatch(getEntitiesByPostId({ postId: parseInt(id, 10) }));
      dispatch(getImagesByPostId({ id: parseInt(id, 10) }));
    }
  }, []);

  // useEffect(() => {
  //   if (paragraphList.length > 0) {
  //     paragraphList.forEach(paragraph => {
  //       dispatch(getEntitiesByParagraphId({ id: paragraph.id }));
  //     });
  //   }
  // }, [paragraphList, dispatch]);

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sortEntities = () => {
    if (id) {
      dispatch(
        getEntitiesByPostId({
          postId: parseInt(id, 10),
          sort: `${sortState.sort},${sortState.order}`,
        })
      );
    }
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const openDeleteModal = (paragraph) => {
    setParagraphToDelete(paragraph);
    setModalOpen(true);
  };

  const openDeleteImageModal = (image) => {
    setImageToDelete(image);
    setModalOpen(true);
  };

  const handleEditClick = (paragraph) => {
    setIsEditParagraph(true);
    dispatch(getEntity(paragraph.id));
    setEditParagraph(paragraph);
    setModalOpen(true);
  };
  const handleEditImageClick = (values, p) => {
    dispatch(getImageId(values.id));
    setEditImage(values);
    dispatch(getEntity(p.id));
    setEditParagraph(p);
    setModalOpen(true);
    setIsEditImage(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditParagraph(null);
    setIsEditParagraph(null);
    setEditImage(null);
    setIsEditImage(null);
    setParagraphToDelete(null);
    setImageToDelete(null);
    // dispatch(reset());
  };
  const formatCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  //làm nút save với nút create đi
  const defaultValues = () =>
    editParagraph
      ? {
          ...editParagraph,
          createdAt: convertDateTimeFromServer(editParagraph.createdAt),
          updateAt: formatCurrentDateTime(),
          post: editParagraph.post ? editParagraph.post.id : null,
        }
      : {};
  const defaultValuesImages = () =>
    isNewImage
      ? {
          taken: formatCurrentDateTime(),
          uploaded: formatCurrentDateTime(),
          paragraph: editImage?.paragraph?.id,
        }
      : {
          ...editImage,
          taken: convertDateTimeFromServer(editImage.taken),
          uploaded: formatCurrentDateTime(),
          person: editImage?.person?.id,
          album: editImage?.album?.id,
          paragraph: editImage?.paragraph?.id,
        };

  const handleCreateClick = () => {
    setIsEditParagraph(true);
    setEditParagraph({
      createdAt: formatCurrentDateTime(),
      updateAt: formatCurrentDateTime(),
      post: parseInt(id, 10),
    });
    setModalOpen(true);
  };
  const handleCreateClickImage = (values) => {
    setEditImage({
      createdAt: formatCurrentDateTime(),
      updateAt: formatCurrentDateTime(),
      // paragraph: parseInt(id, 10),
    });
    setEditParagraph(values);
    setIsEditImage(true);
    setModalOpen(true);
  };
  const saveEntity = (values) => {
    if (values.id !== undefined && typeof values.id !== "number") {
      values.id = Number(values.id);
    }
    if (values.order !== undefined && typeof values.order !== "number") {
      values.order = Number(values.order);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updateAt = convertDateTimeToServer(values.updateAt);
    values.name = values.description ? values.description.substring(0, 50) : "";
    values.order = 1;
    values.view = 0;

    const entity = {
      ...editParagraph,
      ...values,
      post: postEntity,
    };
    if (isNew) {
      dispatch(createEntity({ entity, postId: parseInt(id, 10) }));
      dispatch(getImagesByPostId({ id: parseInt(id, 10) }));
    } else {
      dispatch(updateEntity(entity));
    }
    handleCloseModal();
  };
  const saveEntityImage = (values) => {
    if (values.id !== undefined && typeof values.id !== "number") {
      values.id = Number(values.id);
    }
    if (values.height !== undefined && typeof values.height !== "number") {
      values.height = Number(values.height);
    }
    if (values.width !== undefined && typeof values.width !== "number") {
      values.width = Number(values.width);
    }
    values.taken = convertDateTimeToServer(values.taken);
    values.uploaded = convertDateTimeToServer(values.uploaded);
    const entity = {
      ...editImage,
      ...values,
      person: editImage.person,
      album: editImage.album,
      paragraph: editParagraph,
    };
    if (isNewImage) {
      dispatch(createEntityImage(entity));
      navigate(0);
    } else {
      dispatch(updateEntityImage(entity));
    }
    handleCloseModal();
  };

  return (
    <div className="news-article-container post">
      <div className="article-category">{postEntity.category?.name}</div>
      <h2 id="paragraph-heading" data-cy="ParagraphHeading">
        {/* <Translate contentKey="jhSeaportApp.paragraph.home.title">Paragraphs</Translate> */}
        <div className="article-title">{postEntity.name}</div>
        {/* <div className="container"> */}
        <div className="paragraph-timestamp">
          {/* <span>
            <Translate contentKey="jhSeaportApp.paragraph.createdAt">Created At</Translate>:
          </span>{' '} */}
          <TextFormat
            type="date"
            value={postEntity.createdAt}
            format="YYYY-MM-DD HH:mm"
          />
        </div>
        <div className="article-author">
          {/* <Translate contentKey="jhSeaportApp.post.author">Author</Translate>: */}
          | {postEntity.person?.name}
        </div>
        {/* </div> */}
        <div>view: {postEntity.view}</div>
        <div className="d-flex justify-content-end article-controls">
          <Button
            className="me-2"
            color="info"
            onClick={handleSyncList}
            disabled={loading}
          >
            <FontAwesomeIcon icon="sync" spin={loading} />{" "}
            <Translate contentKey="jhSeaportApp.paragraph.home.refreshListLabel">
              Refresh List
            </Translate>
          </Button>
          <Button
            to="/paragraph/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            onClick={handleCreateClick}
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="jhSeaportApp.paragraph.home.createLabel">
              Create new Paragraph
            </Translate>
          </Button>
        </div>
      </h2>
      <div className="table-responsive">
        {paragraphList && paragraphList.length > 0
          ? paragraphList.map((paragraph) => (
              <Card className="profile-post-card mb-3" key={paragraph.id}>
                <CardBody className="profile-post-body">
                  <div className="paragraph-content">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleEditClick(paragraph)}
                        disabled={updating}
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> &nbsp;
                        <Translate contentKey="entity.action.edit">
                          Edit
                        </Translate>
                      </Button>
                      <Button
                        // onClick={() => (window.location.href = `/paragraph/${paragraph.id}/delete`)}
                        onClick={() => openDeleteModal(paragraph)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{" "}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">
                            Delete
                          </Translate>
                        </span>
                      </Button>
                      <Button
                        // to="/image/new"
                        onClick={() => handleCreateClickImage(paragraph)}
                        className="btn btn-primary jh-create-entity"
                        id="jh-create-entity"
                        data-cy="entityCreateButton"
                      >
                        <FontAwesomeIcon icon="plus" />
                        &nbsp;
                        <Translate contentKey="jhSeaportApp.image.home.createLabel">
                          Create new Image
                        </Translate>
                      </Button>
                    </div>
                    {/* <p>{paragraph.name}</p> */}
                    <div
                      className="paragraph-text"
                      style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                    >
                      {paragraph.description}
                    </div>
                    {imageList
                      .filter(
                        (image) =>
                          image.paragraph && image.paragraph.id === paragraph.id
                      )
                      .map((image) => (
                        <div>
                          <Button
                            onClick={() =>
                              handleEditImageClick(image, paragraph)
                            }
                            tag={Link}
                            color="primary"
                            size="sm"
                            data-cy="entityEditButton"
                          >
                            <FontAwesomeIcon icon="pencil-alt" />{" "}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.edit">
                                Edit
                              </Translate>
                            </span>
                          </Button>
                          <Button
                            // onClick={() => (window.location.href = `/image/${image.id}/delete`)}
                            onClick={() => openDeleteImageModal(image)}
                            color="danger"
                            size="sm"
                            data-cy="entityDeleteButton"
                          >
                            <FontAwesomeIcon icon="trash" />{" "}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.delete">
                                Delete
                              </Translate>
                            </span>
                          </Button>
                          <img
                            key={image.id}
                            src={`data:${image.imageContentType};base64,${image.image}`}
                            alt={image.name}
                            className="paragraph-image"
                          />
                          <div className="image-caption">{image.name}</div>
                        </div>
                      ))}
                  </div>
                </CardBody>
              </Card>
            ))
          : !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="jhSeaportApp.paragraph.home.notFound">
                  No Paragraphs found
                </Translate>
              </div>
            )}
        <div className="article-author-footer">
          {/* <Translate contentKey="jhSeaportApp.post.author">Author</Translate>: */}
          {postEntity.person?.name}
        </div>
      </div>

      <Modal isOpen={modalOpen} toggle={handleCloseModal} size="lg">
        <ModalHeader toggle={handleCloseModal}>
          {isEditParagraph && (
            <Translate contentKey="jhSeaportApp.paragraph.home.createOrEditLabel">
              Create or edit a Paragraph
            </Translate>
          )}
          {isEditImage && (
            <Translate contentKey="jhSeaportApp.image.home.createOrEditLabel">
              Create or edit an Image
            </Translate>
          )}
          {paragraphToDelete && (
            <Translate
              contentKey="jhSeaportApp.paragraph.delete.question"
              interpolate={{ id: paragraphToDelete.name }}
            >
              Are you sure you want to delete this Paragraph?
            </Translate>
          )}
          {imageToDelete && (
            <Translate
              contentKey="jhSeaportApp.image.delete.question"
              interpolate={{ id: imageToDelete.name }}
            >
              Are you sure you want to delete this Image?
            </Translate>
          )}
        </ModalHeader>
        <ModalBody>
          {imageToDelete && (
            <div>
              <Button color="secondary" onClick={handleCloseModal}>
                <FontAwesomeIcon icon="ban" />
                &nbsp;
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
              <Button
                id="jhi-confirm-delete-paragraph"
                data-cy="entityConfirmDeleteButton"
                color="danger"
                onClick={() => {
                  if (imageToDelete) {
                    dispatch(deleteImageEntity(imageToDelete.id));
                    navigate(0);
                  }
                  handleCloseModal();
                }}
              >
                <FontAwesomeIcon icon="trash" />
                &nbsp;
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            </div>
          )}
          {paragraphToDelete && (
            <div>
              <Button color="secondary" onClick={handleCloseModal}>
                <FontAwesomeIcon icon="ban" />
                &nbsp;
                <Translate contentKey="entity.action.cancel">Cancel</Translate>
              </Button>
              <Button
                id="jhi-confirm-delete-paragraph"
                data-cy="entityConfirmDeleteButton"
                color="danger"
                onClick={() => {
                  if (paragraphToDelete) {
                    dispatch(
                      deleteEntity({
                        id: paragraphToDelete.id,
                        postId: parseInt(id, 10),
                      })
                    );
                  }
                  handleCloseModal();
                }}
              >
                <FontAwesomeIcon icon="trash" />
                &nbsp;
                <Translate contentKey="entity.action.delete">Delete</Translate>
              </Button>
            </div>
          )}
          {/* {paragraphToDelete && <DeleteConfirmationButtons
            paragraphToDelete={paragraphToDelete.id}
            postId={parseInt(id, 10)}
            handleCloseModal={handleCloseModal}
          />} */}
          {isEditParagraph && (
            <ValidatedForm
              defaultValues={defaultValues()}
              onSubmit={saveEntity}
            >
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="paragraph-id"
                  label={translate("global.field.id")}
                  validate={{ required: true }}
                />
              ) : null}
              {/* <ValidatedField
                label={translate('jhSeaportApp.paragraph.name')}
                id="paragraph-name"
                name="name"
                data-cy="name"
                type="text"
                // validate={{
                //   required: {
                //     value: true,
                //     message: translate('entity.validation.required'),
                //   },
                // }}
              /> */}
              <ValidatedField
                label={translate("jhSeaportApp.paragraph.description")}
                id="paragraph-description"
                name="description"
                data-cy="description"
                type="textarea"
                className="custom-textarea"
              />
              {/* <ValidatedField
                label={translate('jhSeaportApp.paragraph.order')}
                id="paragraph-order"
                name="order"
                data-cy="order"
                type="text"
                // validate={{
                //   required: {
                //     value: true,
                //     message: translate('entity.validation.required'),
                //   },
                //   validate: v => isNumber(v) || translate('entity.validation.number'),
                // }}
              /> */}
              <ValidatedField
                label={translate("jhSeaportApp.paragraph.createdAt")}
                id="paragraph-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate("jhSeaportApp.paragraph.updateAt")}
                id="paragraph-updateAt"
                name="updateAt"
                data-cy="updateAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              {/* <ValidatedField id="paragraph-post" name="post" data-cy="post" label={translate('jhSeaportApp.paragraph.post')} type="select">
                <option value="" key="0" />
              </ValidatedField> */}
              <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/paragraph"
                replace
                color="info"
              >
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button
                color="primary"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                type="submit"
                disabled={updating}
              >
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
          {isEditImage && (
            <ValidatedForm
              defaultValues={defaultValuesImages()}
              onSubmit={saveEntityImage}
            >
              {!isNewImage ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="image-id"
                  label={translate("global.field.id")}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate("jhSeaportApp.image.name")}
                id="image-name"
                name="name"
                data-cy="name"
                type="text"
                validate={{
                  required: {
                    value: true,
                    message: translate("entity.validation.required"),
                  },
                }}
              />
              <ValidatedBlobField
                label={translate("jhSeaportApp.image.image")}
                id="image-image"
                name="image"
                data-cy="image"
                isImage
                accept="image/*"
                validate={{
                  required: {
                    value: true,
                    message: translate("entity.validation.required"),
                  },
                }}
              />
              <ValidatedField
                label={translate("jhSeaportApp.image.height")}
                id="image-height"
                name="height"
                data-cy="height"
                type="text"
              />
              <ValidatedField
                label={translate("jhSeaportApp.image.width")}
                id="image-width"
                name="width"
                data-cy="width"
                type="text"
              />
              <ValidatedField
                label={translate("jhSeaportApp.image.taken")}
                id="image-taken"
                name="taken"
                data-cy="taken"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate("jhSeaportApp.image.uploaded")}
                id="image-uploaded"
                name="uploaded"
                data-cy="uploaded"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              {/* <ValidatedField id="image-person" name="person" data-cy="person" label={translate('jhSeaportApp.image.person')} type="select">
                <option value="" key="0" />
              </ValidatedField>
              <ValidatedField id="image-album" name="album" data-cy="album" label={translate('jhSeaportApp.image.album')} type="select">
                <option value="" key="0" />
              </ValidatedField>
              <ValidatedField
                id="image-paragraph"
                name="paragraph"
                data-cy="paragraph"
                label={translate('jhSeaportApp.image.paragraph')}
                type="select"
              >
                <option value="" key="0" />
              </ValidatedField> */}
              <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/image"
                replace
                color="info"
              >
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button
                color="primary"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                type="submit"
                disabled={updating}
              >
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ParagraphPostId;
