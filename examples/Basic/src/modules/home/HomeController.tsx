import MapboxGL from '@react-native-mapbox-gl/maps';
import {Box, Center, Text, Button, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import BubbleCard from '../../components/BubbleCard';
import MyMap from '../../components/MyMap';
import {allArequipa} from '../../lib/geocore';
import {setupOfflineMaps} from '../../lib/mapbox';
import {PickMode} from '../../lib/types';

setupOfflineMaps();

type StaticPick = {
  id: string;
  latitude: number;
  longitude: number;
};

const HomeController = () => {
  const [currentPosition, setCurrentPosition] = useState<number[]>([0.0, 0.0]);
  const [userLocation, setUserLocation] = useState<MapboxGL.Location>();
  const [pickMode, setPickMode] = useState<PickMode>(PickMode.CurrentPosition);
  const [staticPicks, setStaticPicks] = useState<StaticPick[]>([]);
  const [cameraCenter, setCameraCenter] = useState<number[]>([-12.05, -77.05]);

  const togglePickMode = () => {
    console.info('toggle pick mode', pickMode);
    if (pickMode === PickMode.CurrentPosition) {
      setPickMode(PickMode.ManualPick);
    } else if (pickMode === PickMode.ManualPick) {
      setPickMode(PickMode.CurrentPosition);
    }
  };

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(status => {
        console.log(status);
        Geolocation.watchPosition(
          position => {
            console.log(position);
            const p = [position.coords.longitude, position.coords.latitude];
            setCurrentPosition(p);
            setCameraCenter(p);
          },
          error => console.log(error.code, error.message),
          {
            enableHighAccuracy: true,
            accuracy: {android: 'high'},
          },
        );
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    allArequipa(100)
      .then(data => {
        console.log(`fetched ${data.length} points`);
        const points = data.map(d => ({
          id: d.id,
          latitude: d.lat,
          longitude: d.lng,
        }));

        const centralPoint = points[Math.floor(points.length / 2)];

        setStaticPicks(points);
        setCameraCenter([centralPoint.longitude, centralPoint.latitude]);

        // markerInstance.current.
        //   data
        //     .slice(100)
        //     .map(d => ({id: d.id, latitude: d.lat, longitude: d.lng})),
        // );
      })
      .catch(err => console.log(err));
  }, []);

  const savePointCallback = () => {
    console.log({userLocation});
    return null;
  };

  return (
    <Center my={6}>
      <Box my={2}>
        <Text fontSize={28}>GeoForm Tech Demo</Text>
      </Box>
      <BubbleCard location={userLocation} />
      <MyMap cameraCenter={cameraCenter} setUserLocation={setUserLocation} />

      <HStack space={4}>
        <Button onPress={togglePickMode}>Change Mode</Button>
        <Button onPress={savePointCallback}>Save Point</Button>
      </HStack>
    </Center>
  );
};

export default HomeController;
