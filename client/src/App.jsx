import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function App() {
    const [people, setPeople] = useState([]); // State to store the list of people data fetched from the server
    const [page, setPage] = useState(1); // State to keep track of the current page number for pagination
    const [totalPages, setTotalPages] = useState(1); // State to keep track of the total number of pages
    const [prefetchData, setPrefetchData] = useState(null); // State to store prefetched data

    // Function to fetch people data
    const fetchPeople = useCallback(async (pageNumber) => {
        console.log(`Fetching people data for page: ${pageNumber}`); // Log the page being fetched
        try {
            // Fetch paginated people data from the backend newApi
            const response = await axios.get(`http://localhost:5000/newApi/people?page=${pageNumber}&limit=100`);
            if (response.data && Array.isArray(response.data)) {
                console.log(`Successfully fetched ${response.data.length} people from the server.`); // Log success message with number of records fetched
                return response.data;
            } else {
                console.error('Unexpected response format:', response.data); // Log unexpected response format
                return [];
            }
        } catch (error) {
            console.error('Error fetching people data:', error); // Log any errors that occur during the fetch process
            return [];
        }
    }, []);

    // Fetch people data when the component mounts or the page changes
    useEffect(() => {
        const loadPeople = async () => {
            const data = prefetchData && prefetchData.page === page ? prefetchData.data : await fetchPeople(page);
            setPeople(data); // Update state with the fetched data
            setTotalPages(Math.ceil(20000 / 100)); // Assuming there are 20,000 people in total
        };
        loadPeople();
    }, [page, fetchPeople, prefetchData]);

    // Prefetch the next page's data for faster loading
    useEffect(() => {
        const prefetchNextPage = async () => {
            if (page < totalPages) {
                const nextPageData = await fetchPeople(page + 1);
                setPrefetchData({ page: page + 1, data: nextPageData }); // Store prefetched data for the next page
            }
        };
        prefetchNextPage();
    }, [page, totalPages, fetchPeople]);

    // Handle deleting an image path for a specific person
    const handleDeletePath = async (id, column) => {
        console.log(`Attempting to delete image path for person ID: ${id}, column: ${column}`); // Log the ID and column to be deleted
        if (window.confirm('האם אתה בטוח שברצונך למחוק את נתיב התמונה הזו מבסיס הנתונים?')) { // Confirm with the user before deleting
            try {
                // Send a POST request to delete the specified image path from the database
                const response = await axios.post('http://localhost:5000/newApi/delete-path', { id, column });
                if (response.data.success) {
                    console.log(`Successfully deleted image path for person ID: ${id}, column: ${column}`); // Log success message
                    alert('נתיב התמונה נמחק בהצלחה מבסיס הנתונים'); // Alert user that the image path was successfully deleted
                    // Update the state to reflect the deleted image path
                    setPeople((prevPeople) =>
                        prevPeople.map((person) =>
                            person.id === id ? { ...person, [column]: null } : person // Set the image path to null for the given column if the person's ID matches
                        )
                    );
                } else {
                    console.error('Error deleting image path:', response.data.error); // Log error message
                    alert('אירעה שגיאה במחיקת נתיב התמונה: ' + (response.data.error || 'שגיאה לא ידועה')); // Alert user if an error occurred during deletion
                }
            } catch (error) {
                console.error('Error deleting image path:', error); // Log any errors during the deletion process
                alert('אירעה שגיאה בתקשורת עם השרת: ' + error.message); // Alert user if there was a communication error with the server
            }
        }
    };

    // Handle setting an image as the correct image for a specific person
    const handleSetGoodImage = async (targetId, imagePath) => {
        console.log(`Attempting to set good image for target person ID: ${targetId}, imagePath: ${imagePath}`); // Log the ID and image path being set
        const targetPerson = people.find((p) => p.id === targetId);
        if (targetPerson && targetPerson.good_pics) {
            if (!window.confirm('יש כבר תמונה נבחרת. האם אתה בטוח שברצונך להחליף את התמונה הקיימת?')) {
                console.log('User cancelled the replacement of the existing good image.'); // Log user cancellation
                return; // If user cancels, do not proceed with the update
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/newApi/set-good-pic', { id: targetId, imagePath });
            if (response.data.success) {
                console.log(`Successfully set good image for person ID: ${targetId}`); // Log success message
                setPeople((prevPeople) =>
                    prevPeople.map((person) =>
                        person.id === targetId ? { ...person, good_pics: imagePath } : person // Update 'good_pics' with the new image path if the person's ID matches
                    )
                );
            } else {
                console.error('Error setting good image:', response.data.error); // Log error message
                alert('אירעה שגיאה בעדכון התמונה הנבחרת: ' + (response.data.error || 'שגיאה לא ידועה')); // Alert user if an error occurred during the update
            }
        } catch (error) {
            console.error('Error setting good image:', error); // Log any errors during the update process
            alert('אירעה שגיאה בתקשורת עם השרת: ' + error.message); // Alert user if there was a communication error with the server
        }
    };

    // Handle deleting the correct image for a specific person
    const handleDeleteGoodImage = async (id) => {
        console.log(`Attempting to delete good image for person ID: ${id}`); // Log the ID of the person whose good image is being deleted
        if (window.confirm('האם אתה בטוח שברצונך למחוק את התמונה הנכונה מבסיס הנתונים?')) { // Confirm with the user before deleting
            try {
                const response = await axios.post('http://localhost:5000/newApi/delete-path', { id, column: 'good_pics' });
                if (response.data.success) {
                    console.log(`Successfully deleted good image for person ID: ${id}`); // Log success message
                    alert('התמונה הנכונה נמחקה בהצלחה מבסיס הנתונים'); // Alert user that the good image was successfully deleted
                    setPeople((prevPeople) =>
                        prevPeople.map((person) =>
                            person.id === id ? { ...person, good_pics: null } : person // Set 'good_pics' to null if the person's ID matches
                        )
                    );
                } else {
                    console.error('Error deleting good image:', response.data.error); // Log error message
                    alert('אירעה שגיאה במחיקת התמונה הנכונה: ' + (response.data.error || 'שגיאה לא ידועה')); // Alert user if an error occurred during deletion
                }
            } catch (error) {
                console.error('Error deleting good image:', error); // Log any errors during the deletion process
                alert('אירעה שגיאה בתקשורת עם השרת: ' + error.message); // Alert user if there was a communication error with the server
            }
        }
    };

    // Handle changing to the next page of data
    const handleNextPage = () => {
        if (page < totalPages) {
            console.log(`Changing to next page: ${page + 1}`); // Log the page number being set
            setPage((prevPage) => prevPage + 1); // Increment page number to load the next set of people data
        }
    };

    // Handle changing to the previous page of data
    const handlePreviousPage = () => {
        if (page > 1) {
            console.log(`Changing to previous page: ${page - 1}`); // Log the page number being set
            setPage((prevPage) => prevPage - 1); // Decrement page number to load the previous set of people data
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold text-center mb-8">תמונות אנשים</h1>
            <div className="text-center mb-4">עמוד {page} מתוך {totalPages}</div> {/* Display current page and total pages at the top */}
            <table className="min-w-full bg-white border border-gray-300" style={{ direction: 'rtl' }}>
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">מזהה</th> {/* Header for person ID */}
                        <th className="py-2 px-4 border-b">שם</th> {/* Header for person's name */}
                        <th className="py-2 px-4 border-b">תאריך לידה</th> {/* Header for birth date */}
                        <th className="py-2 px-4 border-b">תאריך פטירה</th> {/* Header for death date */}
                        <th className="py-2 px-4 border-b">תמונה 2021</th> {/* Header for 2021 image */}
                        <th className="py-2 px-4 border-b">תמונה 2020</th> {/* Header for 2020 image */}
                        <th className="py-2 px-4 border-b">תמונה נוספת</th> {/* Header for additional image */}
                        <th className="py-2 px-4 border-b">התמונה הנכונה</th> {/* Header for the correct image */}
                    </tr>
                </thead>
                <tbody>
                    {people && people.length > 0 ? (
                        people.map((person) => (
                            <tr key={person.id}>
                                {/* Display the person's ID */}
                                <td className="py-2 px-4 border-b text-center">{person.id}</td>
                                {/* Display the person's name or an empty string if not available */}
                                <td className="py-2 px-4 border-b text-center">{person.name || ''}</td>
                                {/* Display the person's birth date or an empty string if not available */}
                                <td className="py-2 px-4 border-b text-center">{person.birth_date || ''}</td>
                                {/* Display the person's death date or an empty string if not available */}
                                <td className="py-2 px-4 border-b text-center">{person.death_date || ''}</td>
                                {/* Display the 2021 image if available */}
                                <td className="py-2 px-4 border-b text-center">
                                    {person.gib_2021_numbers_only && (
                                        <div>
                                            {/* Display the 2021 image with drag-and-drop functionality */}
                                            <img
                                                src={person.gib_2021_numbers_only}
                                                alt="תמונה 2021"
                                                className="max-w-xs max-h-24 mx-auto cursor-pointer"
                                                draggable // Allow image to be draggable
                                                onDragEnd={(event) => {
                                                    const targetElement = document.elementFromPoint(event.clientX, event.clientY);
                                                    if (targetElement && targetElement.dataset && targetElement.dataset.personId) {
                                                        handleSetGoodImage(targetElement.dataset.personId, person.gib_2021_numbers_only); // Set good image for the target person
                                                    }
                                                }}
                                            />
                                            {/* Button to delete the 2021 image path */}
                                            <button
                                                onClick={() => handleDeletePath(person.id, 'gib_2021_numbers_only')}
                                                className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                            >
                                                מחק נתיב
                                            </button>
                                        </div>
                                    )}
                                </td>
                                {/* Display the 2020 image if available */}
                                <td className="py-2 px-4 border-b text-center">
                                    {person.old_pics_2020_numbers_only && (
                                        <div>
                                            {/* Display the 2020 image with drag-and-drop functionality */}
                                            <img
                                                src={person.old_pics_2020_numbers_only}
                                                alt="תמונה 2020"
                                                className="max-w-xs max-h-24 mx-auto cursor-pointer"
                                                draggable // Allow image to be draggable
                                                onDragEnd={(event) => {
                                                    const targetElement = document.elementFromPoint(event.clientX, event.clientY);
                                                    if (targetElement && targetElement.dataset && targetElement.dataset.personId) {
                                                        handleSetGoodImage(targetElement.dataset.personId, person.old_pics_2020_numbers_only); // Set good image for the target person
                                                    }
                                                }}
                                            />
                                            {/* Button to delete the 2020 image path */}
                                            <button
                                                onClick={() => handleDeletePath(person.id, 'old_pics_2020_numbers_only')}
                                                className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                            >
                                                מחק נתיב
                                            </button>
                                        </div>
                                    )}
                                </td>
                                {/* Display an additional image if available */}
                                <td className="py-2 px-4 border-b text-center">
                                    {person.pics_stop_numbers_only && (
                                        <div>
                                            {/* Display the additional image with drag-and-drop functionality */}
                                            <img
                                                src={person.pics_stop_numbers_only}
                                                alt="תמונה נוספת"
                                                className="max-w-xs max-h-24 mx-auto cursor-pointer"
                                                draggable // Allow image to be draggable
                                                onDragEnd={(event) => {
                                                    const targetElement = document.elementFromPoint(event.clientX, event.clientY);
                                                    if (targetElement && targetElement.dataset && targetElement.dataset.personId) {
                                                        handleSetGoodImage(targetElement.dataset.personId, person.pics_stop_numbers_only); // Set good image for the target person
                                                    }
                                                }}
                                            />
                                            {/* Button to delete the additional image path */}
                                            <button
                                                onClick={() => handleDeletePath(person.id, 'pics_stop_numbers_only')}
                                                className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                            >
                                                מחק נתיב
                                            </button>
                                        </div>
                                    )}
                                </td>
                                {/* Display the correct image if available */}
                                <td className="py-2 px-4 border-b text-center" data-person-id={person.id}>
                                    {person.good_pics && (
                                        <div>
                                            <img
                                                src={person.good_pics}
                                                alt="התמונה הנכונה"
                                                className="max-w-xs max-h-24 mx-auto"
                                            />
                                            {/* Button to delete the correct image path */}
                                            <button
                                                onClick={() => handleDeleteGoodImage(person.id)}
                                                className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                            >
                                                מחק תמונה נכונה
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                אין נתונים להצגה
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="text-center mt-4">עמוד {page} מתוך {totalPages}</div> {/* Display current page and total pages at the bottom */}
            <div className="flex justify-center mt-4">
                {/* Button to navigate to the previous page of people data */}
                <button onClick={handlePreviousPage} className="bg-blue-500 text-white py-2 px-4 mr-2" disabled={page === 1}>
                    עמוד קודם
                </button>
                {/* Button to navigate to the next page of people data */}
                <button onClick={handleNextPage} className="bg-blue-500 text-white py-2 px-4" disabled={page === totalPages}>
                    עמוד הבא
                </button>
            </div>
        </div>
    );
}

export default App;
