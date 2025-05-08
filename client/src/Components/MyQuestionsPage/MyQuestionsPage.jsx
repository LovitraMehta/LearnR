import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/currentUser';
import { BottomMenu, TopMenu } from '../Commons';
import Quest from '../Commons/Quest';

const MyQuestionsPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchedUser = useSelector((state) => state.currentUserReducer);
    const questionsList = useSelector((state) => state.questionsReducer);
    const questions = questionsList?.data || [];

    const user = fetchedUser?.result || null;

    // Setup screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load user from localStorage
    useEffect(() => {
        const localProfile = JSON.parse(localStorage.getItem('Profile'));
        if (!localProfile) {
            navigate('/login');
        } else {
            dispatch(setCurrentUser(localProfile));
            setLoading(false);
        }
    }, [dispatch, navigate]);

    // Filter questions
    let myQuestions = [];
    if (user && questions.length > 0) {
        myQuestions = questions.filter(question => String(question.userId) === String(user._id));
    }
    
    
    console.log(myQuestions);

    if (loading) return <div className='text-center mt-10'>Loading...</div>;

    return (
        <div className='bg-[#F2F2F2] w-full h-full'>
            <div id="myquestions_header" className={`${isMobile ? '' : 'fixed top-0 z-20'} w-full h-16 px-4`}>
                {
                    isMobile ?
                        <TopMenu currentPage='myquestions' fromPage='home' />
                        :
                        <div className='flex justify-between items-center'>
                            <NavLink to={'/'}><div className='text-2xl font-semibold'>LearnR</div></NavLink>
                            <TopMenu currentPage='myquestions' fromPage='home' />
                        </div>
                }
            </div>

            <div id="myquestions_body" className={`${isMobile ? '' : 'pt-16'} flex justify-center items-start w-full h-full`}>
                <main className={`${isMobile ? 'h-full w-full' : 'h-[91vh] overflow-y-auto w-[50%] pb-[96px]'}`}>
                    <div id='feedArea' className={`bg-[#F2F2F2] flex flex-col py-2`}>
                        <div id='questList' className='flex flex-col items-center pt-4 gap-4 w-full'>
                            {
                                myQuestions.length > 0 ? (
                                    myQuestions.map((question, key) => (
                                        <Quest question={question} key={key} />
                                    ))
                                ) : (
                                    <div className='text-sm text-gray-500'>You haven't asked any questions yet.</div>
                                )
                            }
                        </div>
                    </div>

                    <div id='bottomMenu' className="z-50 flex items-center justify-center absolute bottom-0 left-0 right-0 m-auto">
                        <BottomMenu currentPage='QuestionPage' />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyQuestionsPage;
