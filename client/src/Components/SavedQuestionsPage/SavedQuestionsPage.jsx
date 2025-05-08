import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/currentUser';
import { BottomMenu, TopMenu } from '../Commons';
import Quest from '../Commons/Quest';

const SavedQuestionsPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchedUser = useSelector((state) => state.currentUserReducer);
    const questionsList = useSelector((state) => state.questionsReducer);
    const questions = questionsList?.data || [];

    const user = fetchedUser?.result || null;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set user on load
    useEffect(() => {
        const localProfile = JSON.parse(localStorage.getItem('Profile'));
        if (!localProfile) {
            navigate('/login');
        } else {
            dispatch(setCurrentUser(localProfile));
            setLoading(false);
        }
    }, [dispatch, navigate]);

    // Filter saved questions
    let savedQuestions = [];
    if (user && questions.length > 0) {
        const savedQuestionsId = (user.savedQuestions || []).map(id => String(id));
        savedQuestions = questions.filter(q => savedQuestionsId.includes(String(q._id)));
        console.log(savedQuestions);
    }

    if (loading) return <div className="text-center mt-10">Loading saved questions...</div>;

    return (
        <div className='bg-[#F2F2F2] w-full h-full'>
            <div id="saved_header" className={`${isMobile ? '' : 'fixed top-0 z-20'} w-full h-16 px-4`}>
                {
                    isMobile ?
                        <TopMenu currentPage='saved' fromPage='home' />
                        :
                        <div className='flex justify-between items-center'>
                            <NavLink to='/'><div className='text-2xl font-semibold'>LearnR</div></NavLink>
                            <TopMenu currentPage='saved' fromPage='home' />
                        </div>
                }
            </div>

            <div id="saved_body" className={`${isMobile ? '' : 'pt-16'} flex justify-center items-start w-full h-full`}>
                <main className={`${isMobile ? 'h-full w-full' : 'h-[91vh] overflow-y-auto w-[50%] pb-[96px]'}`}>
                    <div id='feedArea' className={`bg-[#F2F2F2] flex flex-col py-2`}>
                        <div id='questList' className='flex flex-col items-center pt-4 gap-4 w-full'>
                            {
                                savedQuestions.length > 0 ? (
                                    savedQuestions.map((question, key) => (
                                        <Quest question={question} key={key} />
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">You haven’t saved any questions yet.</div>
                                )
                            }
                        </div>
                    </div>

                    <div id='bottomMenu' className="z-50 flex items-center justify-center absolute bottom-0 left-0 right-0 m-auto">
                        <BottomMenu currentPage='SavedPage' />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SavedQuestionsPage;
