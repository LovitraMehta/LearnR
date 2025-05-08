import { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../../actions/currentUser';
import { BottomMenu, TopMenu } from '../Commons';
import { getUserLevel } from './../../utils';
import AvatarArray from './../../Assets/images/DrawKitAvtars';
import { UserBadgeIcon } from './../../Assets/images/Icons';
// import Analytics from './Analytics';

const ProfilePage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchedUser = useSelector((state) => state.currentUserReducer);
    const usersList = useSelector((state) => state.usersReducer);

    // ✅ Resize listener for mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Load current user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('Profile');
        if (storedUser) {
            dispatch(setCurrentUser(JSON.parse(storedUser)));
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate]);

    if (!usersList || usersList.length === 0) {
        return (
            <div className="p-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                Loading profile...
            </div>
        );
    }

    const currentProfile = usersList.find((user) => user._id === id);
    // console.log(currentProfile);
    if (!currentProfile) {
        return (
            <div className="w-full text-center mt-20 text-lg font-medium text-red-500">
                User not found
            </div>
        );
    }

    const currentProfileUserLevel = getUserLevel(
        currentProfile.noOfQuestionsAsked,
        currentProfile.noOfAnswersGiven
    );

    return (
        <div className="bg-[#F2F2F2] w-full h-full">
            {/* Top Header */}
            <div id="profile_header" className={`${isMobile ? '' : 'fixed top-0 z-20'} w-full h-20 px-6 bg-[#F2F2F2]`}>
                {isMobile ? (
                    <TopMenu currentPage="profile" fromPage="home" />
                ) : (
                    <div className="flex justify-between items-center">
                        <NavLink to={'/'}>
                            <div className="text-3xl font-semibold">LearnR</div>
                        </NavLink>
                        <TopMenu currentPage="profile" fromPage="home" />
                    </div>
                )}
            </div>

            {/* Main Profile Content */}
            <div id="profile_body" className={`${isMobile ? '' : 'pt-20'} flex flex-col justify-center items-center w-full h-full`}>
                <div id="profile_info" className="px-6 flex flex-col w-full">
                    {/* Profile Avatar & Stats */}
                    <div className="flex justify-between items-center mb-6">
                        <div id="profile_pic" className="w-[120px] h-[120px] rounded-full overflow-hidden">
                            <img src={AvatarArray[currentProfile.avtarIndex]} alt={currentProfile.firstName} />
                        </div>
                        <div id="numbers" className="w-[200px] flex justify-between items-center font-medium">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-2xl">{currentProfile.noOfQuestionsAsked}</div>
                                <div className="text-base">Asked</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-2xl">{currentProfile.noOfAnswersGiven}</div>
                                <div className="text-base">Answered</div>
                            </div>
                        </div>
                    </div>

                    {/* Name, Badge & About */}
                    <div className="flex flex-col mb-4">
                        <div className="text-xl font-semibold">{`${currentProfile.firstName} ${currentProfile.lastName}`}</div>
                        <div className="flex justify-start items-center gap-2">
                            <div className="w-[20px] h-auto">
                                <img src={UserBadgeIcon} alt={`Badge of ${currentProfile.firstName}`} width={20} />
                            </div>
                            <div className="font-light text-lg text-[#656565]">{currentProfileUserLevel}</div>
                        </div>
                        <div className="text-sm text-justify mt-2">{currentProfile.about}</div>
                    </div>

                    {/* Tags Section */}
                    <div id="tags" className="flex justify-start items-center gap-2 py-2 flex-wrap">
                        {currentProfile.tags.map((tag, key) => (
                            <div
                                className="bg-white h-[24px] rounded-[12px] text-xs font-light flex justify-center items-center px-2 border-2 border-[#CCCCCC] hover:bg-[#f0f0f0] cursor-pointer"
                                key={key}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>

                    {/* Analytics Section */}
                    {/* <Analytics graphData={currentProfile.graphData} /> */}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div id="bottomMenu" className="z-50 flex items-center justify-center absolute bottom-0 left-0 right-0 m-auto py-4">
                <BottomMenu currentPage="ProfilePage" />
            </div>
        </div>
    );
};

export default ProfilePage;
