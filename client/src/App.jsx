import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [people, setPeople] = useState([]); // State to store the people data
    const [page, setPage] = useState(1); // State to keep track of the current page

    // Fetch people data from the server when the component mounts or page changes
    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/people?page=${page}&limit=100`);
                setPeople(response.data); // Update state with the fetched data
            } catch (error) {
                console.error('Error fetching people data:', error); // Log any errors during fetch
            }
        };
        fetchPeople();
    }, [page]);

    // Handle delete image path action
    const handleDeletePath = async (id, column) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את נתיב התמונה הזו מבסיס הנתונים?')) {
            try {
                const response = await axios.post('http://localhost:5000/api/delete-path', { id, column });
                if (response.data.success) {
                    alert('נתיב התמונה נמחק בהצלחה מבסיס הנתונים');
                    // Update state to reflect the deleted image path
                    setPeople((prevPeople) =>
                        prevPeople.map((person) =>
                            person.id === id ? { ...person, [column]: null } : person
                        )
                    );
                } else {
                    alert('אירעה שגיאה במחיקת נתיב התמונה: ' + (response.data.error || 'שגיאה לא ידועה'));
                }
            } catch (error) {
                console.error('Error deleting image path:', error); // Log any errors during deletion
                alert('אירעה שגיאה בתקשורת עם השרת: ' + error.message);
            }
        }
    };

    // Handle page change
    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold text-center mb-8">תמונות אנשים</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">מזהה</th>
                        <th className="py-2 px-4 border-b">שם</th>
                        <th className="py-2 px-4 border-b">תאריך לידה</th>
                        <th className="py-2 px-4 border-b">תאריך פטירה</th>
                        <th className="py-2 px-4 border-b">תמונה 2021</th>
                        <th className="py-2 px-4 border-b">תמונה 2020</th>
                        <th className="py-2 px-4 border-b">תמונה נוספת</th>
                    </tr>
                </thead>
                <tbody>
                    {people.map((person) => (
                        <tr key={person.id}>
                            <td className="py-2 px-4 border-b text-center">{person.id}</td>
                            <td className="py-2 px-4 border-b text-center">{person.name || ''}</td>
                            <td className="py-2 px-4 border-b text-center">{person.birth_date || ''}</td>
                            <td className="py-2 px-4 border-b text-center">{person.death_date || ''}</td>
                            <td className="py-2 px-4 border-b text-center">
                                {person.gib_2021_numbers_only && (
                                    <div>
                                        <img
                                            src={person.gib_2021_numbers_only}
                                            alt="תמונה 2021"
                                            className="max-w-xs max-h-24 mx-auto"
                                        />
                                        <button
                                            onClick={() => handleDeletePath(person.id, 'gib_2021_numbers_only')}
                                            className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                        >
                                            מחק נתיב
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {person.old_pics_2020_numbers_only && (
                                    <div>
                                        <img
                                            src={person.old_pics_2020_numbers_only}
                                            alt="תמונה 2020"
                                            className="max-w-xs max-h-24 mx-auto"
                                        />
                                        <button
                                            onClick={() => handleDeletePath(person.id, 'old_pics_2020_numbers_only')}
                                            className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                        >
                                            מחק נתיב
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                {person.pics_stop_numbers_only && (
                                    <div>
                                        <img
                                            src={person.pics_stop_numbers_only}
                                            alt="תמונה נוספת"
                                            className="max-w-xs max-h-24 mx-auto"
                                        />
                                        <button
                                            onClick={() => handleDeletePath(person.id, 'pics_stop_numbers_only')}
                                            className="delete-btn bg-red-500 text-white mt-2 py-1 px-3"
                                        >
                                            מחק נתיב
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                <button onClick={handlePreviousPage} className="bg-blue-500 text-white py-2 px-4 mr-2" disabled={page === 1}>
                    עמוד קודם
                </button>
                <button onClick={handleNextPage} className="bg-blue-500 text-white py-2 px-4">
                    עמוד הבא
                </button>
            </div>
        </div>
    );
};

export default App
