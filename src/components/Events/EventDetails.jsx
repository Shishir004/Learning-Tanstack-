import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery ,useMutation } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { deleteEvent, fetchEvent, queryclient } from '../../util/util.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx'

export default function EventDetails() {
  const[isDeleting , setIsDeleting]=useState(false);
  const navigate=useNavigate();
  const params=useParams();
  const{data , isError , isPending , error}=useQuery({
    queryFn:({signal})=>fetchEvent({signal , id:params.id}),
    queryKey:['events',params.id]
  })
  const{mutate , isPending:isPendingDeletion ,isError:isErrorDeleting, error:deleteError }=useMutation({
    mutationFn:deleteEvent,
    onSuccess:()=>{
      queryclient.invalidateQueries({queryKey:['events'],refetchType:'none'});
      navigate('/');
    }
  });
  function handleStartDelete(){
    setIsDeleting(true);
  }
  function handleStopDeleting(){
    setIsDeleting(false);
  }
  const handleDelete=()=>{
    mutate({id:params.id});
  }
  let content;
  if(isPending)
  {
    content=<LoadingIndicator/>
  }
  if(isError)
  {
    <ErrorBlock title='failed to load messages' message={error.info?.message || 'failed to fetch event data'}/>
  }
  if(data)
  {
    content=(
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
    <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
    </div>;
      </>
    )
  }
  return (
    <>
      {isDeleting&&<Modal onClose={handleStopDeleting}>
        <h2>Are you sure</h2>
        <p>Do you want to really delete this ???</p>
        <div className='form-actions'>
        {isPendingDeletion?
        <p>Deleting, Please Wait...</p>:
        <>
          <button onClick={handleStopDeleting} className='botton-text'>Cancel</button>
          <button onClick={handleDelete} className='botton'>Delete</button>
        </>}
        </div>
      </Modal>}
      {isErrorDeleting && <ErrorBlock title='failed to delete events' message={deleteError.info?.message || 'failed to delete the message'}/>}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
