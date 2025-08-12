import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [docName, setDocName] = useState('')
  const [docEmail, setDocEmail] = useState('')
  const [docPassword, setDocPassword] = useState('')
  const [docExperience, setDocExperience] = useState('')
  const [docFees, setDocFees] = useState('')
  const [docSpecialization, setDocSpecialization] = useState('')
  const [docEducation, setDocEducation] = useState('')
  const [docPhone, setDocPhone] = useState('')
  const [docAddress1, setDocAddress1] = useState('')
  const [docAddress2, setDocAddress2] = useState('')
  const [docAbout, setDocAbout] = useState('')

  const { aToken, backendUrl } = useContext(AdminContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if(!docImg) {
        return toast.error("Please upload a doctor image");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", docName);
      formData.append("email", docEmail);
      formData.append("password", docPassword);
      formData.append("experience", docExperience);
      formData.append("fees", Number(docFees));
      formData.append("speciality", docSpecialization);
      formData.append("degree", docEducation);
      formData.append("phone", docPhone);
      formData.append("address", JSON.stringify({ line1: docAddress1, line2: docAddress2 }));
      formData.append("about", docAbout);

      console.log("Form Data:", formData);

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {
        headers: { aToken }
      });
      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setDocName('');
        setDocEmail('');
        setDocPassword('');
        setDocExperience('');
        setDocFees('');
        setDocSpecialization('');
        setDocEducation('');
        setDocPhone('');
        setDocAddress1('');
        setDocAddress2('');
        setDocAbout('');
      } else {
        toast.error(data.message);
      }

      
    } catch (error) {

      toast.error(error.message)
      console.error("Error adding doctor:", error);
      
    }

  }




  return (
    <form onSubmit={handleSubmit} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium"> Add Doctor </p>
      <div className="bg-white p-8 border border-gray-200 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-5 mb-5 text-gray-500">
          <label htmlFor="doc-img">
            <img className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer" src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="icon" />
            <input onChange={(e)=> setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          </label>
          <p>
            Upload doctor <br />
            Picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className=" w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <p> Doctor Name</p>
              <input onChange={(e)=> setDocName(e.target.value)} value={docName} className="border border-gray-200 rounded px-3 py-2" type="text" placeholder="Name" required />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p> Doctor Email</p>
              <input onChange={(e)=> setDocEmail(e.target.value)} value={docEmail} className="border border-gray-200 rounded px-3 py-2" type="email" placeholder="Email" required />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p> Doctor Password</p>
              <input onChange={(e)=> setDocPassword(e.target.value)} value={docPassword} className="border border-gray-200 rounded px-3 py-2" type="password" placeholder="Password" required />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p>Experience</p>
              <select onChange={(e)=> setDocExperience(e.target.value)} value={docExperience} className="border border-gray-200 rounded px-3 py-2" name="" id="">
                <option value="">Select Experience</option>
                <option value="1Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p> Fees</p>
              <input onChange={(e)=> setDocFees(e.target.value)} value={docFees} className="border border-gray-200 rounded px-3 py-2" type="number" placeholder="Fees" required />
            </div>
          </div>
          <div className=" w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <p>Specialization</p>
              <select onChange={(e)=> setDocSpecialization(e.target.value)} value={docSpecialization} className="border border-gray-200 rounded px-3 py-2" name="" id="">
                <option value="">Select Specialization</option>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p>Education</p>
              <input onChange={(e)=> setDocEducation(e.target.value)} value={docEducation} className="border border-gray-200 rounded px-3 py-2" type="text" placeholder="Education" required />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p>Phone</p>
              <input onChange={(e)=> setDocPhone(e.target.value)} value={docPhone} className="border border-gray-200 rounded px-3 py-2" type="tel" placeholder="Phone" required />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p>Address</p>
              <input onChange={(e)=> setDocAddress1(e.target.value)} value={docAddress1} className="border border-gray-200 rounded px-3 py-2" type="text" placeholder="Address 1" required />
              <input onChange={(e)=> setDocAddress2(e.target.value)} value={docAddress2} className="border border-gray-200 rounded px-3 py-2" type="text" placeholder="Address 2" />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2"> About Me</p>
          <textarea onChange={(e)=> setDocAbout(e.target.value)} value={docAbout} className="w-full border border-gray-200 rounded px-3 py-2" placeholder="Write about doctor" rows={4} required />
        </div>
        <button className="bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer" type="submit">Add Doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;
