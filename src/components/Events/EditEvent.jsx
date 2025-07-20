import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../../util/util.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const params=useParams();
  const{data , isPending ,isError , error}=useQuery({
    queryFn:({signal})=>fetchEvent({signal,id:params.id}),
    queryKey:['events',params.id]
  })
  function handleSubmit(formData) {}

  function handleClose() {
    navigate('../');
  } 
  let content;
  if(isPending)
  {
    content=<div className='center'>
      <LoadingIndicator/>
    </div>
  }
  if(isError)
  {
    content=
    <>
      <ErrorBlock title="failed to load event" message={error.info?.message || 'failed to load events'}/>
      <div className='form-actions'>
        <Link to= '../' className='button'>
        okay
        </Link>
      </div>
    </>
  }
  if(data)
  {
    content=<EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
  }
  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
