// import axios from '@/plugins/axios';
// import Echo from 'laravel-echo';
// // eslint-disable-next-line no-unused-vars
// import Pusher from 'pusher-js';
// // Pusher.logToConsole = true;
// export default (app) => {
//     app.config.globalProperties.$pusher = new Echo({
//         broadcaster: 'pusher',
//         key: import.meta.env.VITE_PUSHER_APP_KEY,
//         wsHost: import.meta.env.VITE_PUSHER_HOST,
//         wsPort: import.meta.env.VITE_PUSHER_PORT,
//         wssPort: import.meta.env.VITE_PUSHER_PORT,
//         cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//         forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
//         disableStats: true,
//         enabledTransports: ['ws', 'wss'],
//         authorizer: (channel) => {
//             return {
//                 authorize: (socketId, callback) => {
//                     axios
//                         .post(`/broadcasting/auth`, {
//                             socket_id: socketId,
//                             channel_name: channel.name
//                         })
//                         .then((response) => {
//                             callback(null, response.data);
//                         })
//                         .catch((error) => {
//                             callback(error);
//                         });
//                 }
//             };
//         }
//     });
// };

import axios from '@/plugins/axios';
import Pusher from 'pusher-js';

export default (app) => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
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

    app.config.globalProperties.$pusher = pusher;

    // // // Example of subscribing to a channel
    // // const channel = pusher.subscribe('your-channel-name');

    // // // Example of listening to an event on the channel
    // // channel.bind('your-event-name', (data) => {
    // //     console.log('Received event:', data);
    // // });

    // // Example of authorizing private channels
    // axios
    //     .post('/broadcasting/auth', {
    //         socket_id: pusher.connection.socket_id,
    //         channel_name: 'private-your-channel-name'
    //     })
    //     .then((response) => {
    //         console.log('Authorization successful:', response.data);
    //     })
    //     .catch((error) => {
    //         console.error('Authorization failed:', error);
    //     });
};
