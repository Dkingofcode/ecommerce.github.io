import React, {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from '@headlessui/react'
import { sanityClient } from '../../../lib/sanity'


const MyDetails = () => {
  const { user, error } = useUser();
    const [enabled, setEnabled] = useState(false)
      const [userId, setUserId] = useState<string>("");
    const [userdetails, setUserdetails] = useState({
      firstname: "",
      lastname: "",
      dob:"",
      gender: "",
      
    })
    console.log(userdetails);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setUserdetails((prevValues) => ({ ...prevValues, [name]: value }));
    };
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedUserDetails = { ...userdetails, gender: e.target.value };
      setUserdetails(updatedUserDetails);
    };

    useEffect(() => {
      const getUID = async () => {
        const data = await sanityClient.fetch<{ _id: string }[]>(
          `
          *[_type == 'users' && email == $auth0ID]{
            _id
          }`, { auth0ID: user?.email }
        );
  
        setUserId(data[0]?._id || "");
        console.log(data)
      };
      
  
      getUID();
    }, [user]);

    const handleSaveChanges = async () => {
  
      // Prepare the data to send to the server
      const data = {
        _id: userId, // You should set this based on your data structure
        firstname: userdetails.firstname,
        lastname: userdetails.lastname,
        dob: userdetails.dob,
        gender: userdetails.gender

      };
  
        alert("Updating Profile...");
        fetch("/api/updateUser", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              alert("Error Updating Profile");
            } else {
              alert("Profile Updated Successfully 😉");
            }
          })
          .catch((err) => {
            console.log(err, "This didn't");
          });
    };

   
    

  return (
    <div className='mx-4 mb-12'>
      <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveChanges();
        }}>
        <div className='w-12/12 h-auto border-gray-300'>
            <div className=' px-2 py-3'>
              
            <h3 className='text-base font-medium text-gray-600 mb-2'>FIRST NAME</h3>
            <input type="text" name='firstname' className='text-base h-8 outline-none w-full' 
            onChange={handleChange}
            value={userdetails.firstname}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>LAST NAME</h3>
            <input type="text" name='lastname' className='text-base h-8 outline-none w-full'
            onChange={handleChange}
            value={userdetails.lastname}
             />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>EMAIL ADDRESS</h3>
              
                <input type="text" name='email' className='text-base h-8 outline-none w-full' 
                onChange={handleChange}
            
            />

            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>DATE OF BIRTH</h3>
            <input type="date" name='dob' className='text-base h-8 outline-none'
            onChange={handleChange}
            value={userdetails.dob}/>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mt-8 mb-2'>GENDER</h3>
            <div className='text-base mb-8 flex flex-col gap-y-2'>
                <div className='flex gap-x-4'>
                    <input type='radio' value="Male" name="gender" id='male' 
                              checked={userdetails.gender === 'Male'}
                              onChange={handleRadioChange}
                              />
                    <label htmlFor="male">Male</label>
                </div>
                <div className='border-t border-t-gray-300'></div>
                <div className='flex gap-x-4 '>
                    <input type='radio' value="Female" name="gender" id='female'
                    checked={userdetails.gender === 'Female'}
                    onChange={handleRadioChange}
                     />
                    <label htmlFor="female">Female</label>
                </div>
            </div>
            </div>
            
            </div>
            
            <div className=" flex flex-row h-12 w-full justify-evenly mt-2 mb-8 lg:mb-0 px-2 gap-x-4">
            <button type="submit" className=' h-12 bg-black text-white rounded-md w-3/4'>SAVE CHANGES</button>
        </div>
        </form>
        </div>
  )
}

export default MyDetails


              
                    
