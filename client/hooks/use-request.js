// New custom useRequest hook
import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async (props = {}) => {
        try {
            setErrors([]); // Clear previously displayed errors

            const response = await axios[method](url, { ...body, ...props});

            if (onSuccess) onSuccess(response.data);

            return response.data;
        }
        catch (err) {
            setErrors(
                err.response.data.errors.map( err => {
                  return(
                    // {
                    //   errorType: `${err.field}`,
                    //   errorBody:
                    //   <div className='w-full text-lg p-3 mt-3 rounded-lg text-red-600 bg-red-200'>
                    //     <h3> {err.message} </h3>
                    //   </div>
                    // }
                    [
                      `${err.field}`,
                      <div className='w-full text-lg p-3 mt-3 rounded-lg text-red-600 bg-red-200'>
                        <h3> {err.message} </h3>
                      </div>
                    ]
                  );
                })
            );
        }
    };

    return { doRequest, errors };
};
