import { Link, useNavigate } from 'react-router-dom';
import {useMutation} from '@tanstack/react-query'
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/util.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import {queryclient} from '../../util/util.js'

export default function NewEvent() {
  const navigate = useNavigate();
  const{mutate , isPending , isError , error , }=useMutation({
    mutationFn:createNewEvent,
    onSuccess:()=>{
      navigate('/events');
      queryclient.invalidateQueries({queryKey:['events']});
    }
  });
  function handleSubmit(formData) {
    mutate({event:formData})
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending ? 'Submittig...'
        :
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button> 
        </>
        }
      </EventForm>
      {isError && <ErrorBlock title='Failed' message={error.info?.message || 'failed to create event'}/>}
    </Modal>
  );
}
