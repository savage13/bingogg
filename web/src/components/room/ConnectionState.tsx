import { useContext } from 'react';
import { ConnectionStatus, RoomContext } from '../../context/RoomContext';

export default function ConnectionState() {
    const { connectionStatus } = useContext(RoomContext);

    const padding = 'p-2';
    let contents;
    if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
        contents = (
            <div className={`${padding} rounded-md bg-gray-600 bg-opacity-40`}>
                Uninitialized
            </div>
        );
    } else if (connectionStatus === ConnectionStatus.CONNECTING) {
        contents = (
            <div
                className={`${padding} rounded-md bg-orange-400 bg-opacity-80`}
            >
                Connecting
            </div>
        );
    } else if (connectionStatus === ConnectionStatus.CONNECTED) {
        contents = (
            <div className={`${padding} rounded-md bg-green-400 bg-opacity-60`}>
                Connected
            </div>
        );
    } else if (connectionStatus === ConnectionStatus.UNAUTHORIZED) {
        contents = (
            <div className={`${padding} rounded-md bg-red-500 bg-opacity-80`}>
                Unauthorized
            </div>
        );
    } else if (connectionStatus === ConnectionStatus.CLOSING) {
        contents = (
            <div
                className={`${padding} rounded-md bg-orange-400 bg-opacity-80`}
            >
                Disconnecting
            </div>
        );
    } else if (connectionStatus === ConnectionStatus.CLOSED) {
        contents = (
            <div className={`${padding} rounded-md bg-gray-600 bg-opacity-80`}>
                Disconnected
            </div>
        );
    } else {
        contents = (
            <div className={`${padding} rounded-md bg-gray-600 bg-opacity-80`}>
                Unknown connection status
            </div>
        );
    }

    return (
        <div className="rounded-md border border-border text-center">
            {contents}
        </div>
    );
}
