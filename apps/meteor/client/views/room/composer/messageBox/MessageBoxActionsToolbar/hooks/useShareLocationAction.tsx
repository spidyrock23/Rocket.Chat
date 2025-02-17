import type { IRoom } from '@rocket.chat/core-typings';
import { isRoomFederated } from '@rocket.chat/core-typings';
import { useSetting, useSetModal, useTranslation } from '@rocket.chat/ui-contexts';
import React from 'react';

import ShareLocationModal from '../../../../ShareLocation/ShareLocationModal';
import type { ToolbarAction } from './ToolbarAction';

export const useShareLocationAction = (room?: IRoom, tmid?: string): ToolbarAction => {
	if (!room) {
		throw new Error('Invalid room');
	}

	const t = useTranslation();
	const setModal = useSetModal();

	const isMapViewEnabled = useSetting('MapView_Enabled') === true;
	const isGeolocationCurrentPositionSupported = Boolean(navigator.geolocation?.getCurrentPosition);
	const googleMapsApiKey = useSetting('MapView_GMapsAPIKey') as string;
	const canGetGeolocation = isMapViewEnabled && isGeolocationCurrentPositionSupported && googleMapsApiKey && googleMapsApiKey.length;

	const handleShareLocation = () => setModal(<ShareLocationModal rid={room._id} tmid={tmid} onClose={() => setModal(null)} />);

	const allowGeolocation = room && canGetGeolocation && !isRoomFederated(room);

	return {
		id: 'share-location',
		icon: 'map-pin',
		label: t('Location'),
		title: !allowGeolocation ? t('Not_Available') : undefined,
		onClick: handleShareLocation,
		disabled: !allowGeolocation,
	};
};
