import GuestbooksListItem from './GuestBookItem';

const GuestbooksList = ({ guestbooks, onUpdateSuccess, onDeleteSuccess }) => {
    return (
        <div className="space-y-0">
            {guestbooks.map((guestbook) => (
                <GuestbooksListItem
                    key={guestbook.id}
                    guestbook={guestbook}
                    onUpdateSuccess={onUpdateSuccess}
                    onDeleteSuccess={onDeleteSuccess}
                />
            ))}
        </div>
    );
};

export default GuestbooksList;
