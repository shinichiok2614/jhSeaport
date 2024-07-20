import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Row, Col, Form, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Translate, TextFormat, getSortState, translate, isNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ValidatedField, ValidatedForm } from 'react-jhipster';

import { getEntitiesByPostId, getEntity, reset, updateEntity } from './paragraph.reducer';
import { getEntitiesByParagraphId } from '../image/image.reducer';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';

export const ParagraphPostId = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>(); // Lấy postId từ URL

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const paragraphList = useAppSelector(state => state.paragraph.entities);
  const imageList = useAppSelector(state => state.image.entities);
  const loading = useAppSelector(state => state.paragraph.loading);
  const updating = useAppSelector(state => state.paragraph.updating);

  const [editParagraph, setEditParagraph] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getEntitiesByPostId({ postId: parseInt(id, 10) }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (paragraphList.length > 0) {
      paragraphList.forEach(paragraph => {
        dispatch(getEntitiesByParagraphId({ id: paragraph.id }));
      });
    }
  }, [paragraphList, dispatch]);

  const sortEntities = () => {
    if (id) {
      dispatch(
        getEntitiesByPostId({
          postId: parseInt(id, 10),
          sort: `${sortState.sort},${sortState.order}`,
        }),
      );
    }
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    } else {
      return order === ASC ? faSortUp : faSortDown;
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const handleEditClick = paragraph => {
    dispatch(getEntity(paragraph.id));
    setEditParagraph(paragraph);
    setModalOpen(true);
  };

  const handleSave = values => {
    const entity = {
      ...editParagraph,
      ...values,
    };
    dispatch(updateEntity(entity)).then(() => {
      setEditParagraph(null);
      sortEntities();
    });
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditParagraph(null);
    dispatch(reset());
  };
  const formatCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
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
  const isNew = !editParagraph || !editParagraph.id;
  const handleCreateClick = () => {
    setEditParagraph({
      createdAt: formatCurrentDateTime(), // Giá trị ngày giờ hiện tại
      updateAt: formatCurrentDateTime(), // Giá trị ngày giờ hiện tại
      post: parseInt(id, 10), // ID của bài viết hiện tại
    });
    setModalOpen(true);
  }; 
  return (
    <div>
      <h2 id="paragraph-heading" data-cy="ParagraphHeading">
        <Translate contentKey="jhSeaportApp.paragraph.home.title">Paragraphs</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="jhSeaportApp.paragraph.home.refreshListLabel">Refresh List</Translate>
          </Button>
          {/* <Link to="/paragraph/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="jhSeaportApp.paragraph.home.createLabel">Create new Paragraph</Translate>
          </Link> */}
          <Button to="/paragraph/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton" onClick={handleCreateClick}>
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="jhSeaportApp.paragraph.home.createLabel">Create new Paragraph</Translate>
          </Button>
        </div>
      </h2>
      <div className="table-responsive">
        {paragraphList && paragraphList.length > 0
          ? paragraphList.map(paragraph => (
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
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/paragraph/${paragraph.id}/delete`)}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                    <p>{paragraph.description}</p>
                    {imageList
                      .filter(image => image.paragraph && image.paragraph.id === paragraph.id)
                      .map(image => (
                        <img
                          key={image.id}
                          src={`data:${image.imageContentType};base64,${image.image}`}
                          alt={image.name}
                          className="paragraph-image"
                        />
                      ))}
                  </div>
                </CardBody>
              </Card>
            ))
          : !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="jhSeaportApp.paragraph.home.notFound">No Paragraphs found</Translate>
              </div>
            )}
      </div>
      <Modal isOpen={modalOpen} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>
          <Translate contentKey="jhSeaportApp.paragraph.home.createOrEditLabel">Create or edit a Paragraph</Translate>
        </ModalHeader>
        <ModalBody>
          <ValidatedForm defaultValues={defaultValues()} onSubmit={handleSave}>
            {!isNew ? (
              <ValidatedField
                name="id"
                required
                readOnly
                id="paragraph-id"
                label={translate('global.field.id')}
                validate={{ required: true }}
              />
            ) : null}
            <ValidatedField
              label={translate('jhSeaportApp.paragraph.name')}
              id="paragraph-name"
              name="name"
              data-cy="name"
              type="text"
              validate={{
                required: { value: true, message: translate('entity.validation.required') },
              }}
            />
            <ValidatedField
              label={translate('jhSeaportApp.paragraph.description')}
              id="paragraph-description"
              name="description"
              data-cy="description"
              type="textarea"
            />
            <ValidatedField
              label={translate('jhSeaportApp.paragraph.order')}
              id="paragraph-order"
              name="order"
              data-cy="order"
              type="text"
              validate={{
                required: { value: true, message: translate('entity.validation.required') },
                validate: v => isNumber(v) || translate('entity.validation.number'),
              }}
            />
            <ValidatedField
              label={translate('jhSeaportApp.paragraph.createdAt')}
              id="paragraph-createdAt"
              name="createdAt"
              data-cy="createdAt"
              type="datetime-local"
              placeholder="YYYY-MM-DD HH:mm"
            />
            <ValidatedField
              label={translate('jhSeaportApp.paragraph.updateAt')}
              id="paragraph-updateAt"
              name="updateAt"
              data-cy="updateAt"
              type="datetime-local"
              placeholder="YYYY-MM-DD HH:mm"
            />
            {/* <ValidatedField
              id="paragraph-post"
              name="post"
              data-cy="post"
              label={translate('jhSeaportApp.paragraph.post')}
              type="select"
              // value={defaultValues().post}
            ></ValidatedField> */}
            <ValidatedField id="paragraph-post" name="post" data-cy="post" label={translate('jhSeaportApp.paragraph.post')} type="select">
              <option value={parseInt(id, 10)}>{parseInt(id, 10)}</option>
            </ValidatedField>
          </ValidatedForm>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCloseModal}>
            <FontAwesomeIcon icon="ban" />
            &nbsp;
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="primary" type="submit" form="entity-form">
            <FontAwesomeIcon icon="save" />
            &nbsp;
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ParagraphPostId;
