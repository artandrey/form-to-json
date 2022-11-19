import { useCallback, useState } from 'react';

const useFetchCall = (fetch, onResolve) => {
    const [sending, setSending] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const send = useCallback(
        (...args) => {
            setSending(true);
            fetch(...args)
                .then((data) => {
                    if (data.status !== 200) throw Error('In fetch');
                    return data.json();
                })
                .then((data) => {
                    setSending(false);
                    setData(data);
                    setError(null);
                    onResolve && onResolve(null, data);
                })
                .catch((error) => {
                    setSending(false);
                    setData(null);
                    setError(error);
                    onResolve && onResolve(error, null);
                });
        },
        [fetch, onResolve]
    );
    return { sending, data, error, send };
};

export default useFetchCall;
