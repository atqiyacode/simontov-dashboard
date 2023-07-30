import axios from '@/plugins/axios';
import Echo from 'laravel-echo';
// eslint-disable-next-line no-unused-vars
import Pusher from 'pusher-js';
// Pusher.logToConsole = true;
export default (app) => {
    app.config.globalProperties.$pusher = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        wsHost: import.meta.env.VITE_PUSHER_HOST,
        wsPort: import.meta.env.VITE_PUSHER_PORT,
        wssPort: import.meta.env.VITE_PUSHER_PORT,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authorizer: (channel) => {
            return {
                authorize: (socketId, callback) => {
                    axios
                        .post(`/broadcasting/auth`, {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                        .then((response) => {
                            callback(null, response.data);
                        })
                        .catch((error) => {
                            callback(error);
                        });
                }
            };
        }
    });
};
