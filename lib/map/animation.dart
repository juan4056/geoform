import 'package:flutter/animation.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

void animatedMapMove(
  MapController mapController,
  AnimationController animationController,
  LatLng destLocation,
  double destZoom,
) {
  final _latTween = Tween<double>(
    begin: mapController.center.latitude,
    end: destLocation.latitude,
  );

  final _lngTween = Tween<double>(
    begin: mapController.center.longitude,
    end: destLocation.longitude,
  );

  final _zoomTween = Tween<double>(
    begin: mapController.zoom,
    end: destZoom,
  );

  Animation<double> animation = CurvedAnimation(
    parent: animationController,
    curve: Curves.fastOutSlowIn,
  );

  animationController.reset();

  animationController.addListener(() {
    mapController.move(
        LatLng(
          _latTween.evaluate(animation),
          _lngTween.evaluate(animation),
        ),
        _zoomTween.evaluate(animation));
  });

  animationController.addStatusListener((status) {
    if (status == AnimationStatus.completed) {
      // animationController.removeListener(() {});
      // animationController.dispose();
      // animationController.reset();
    } else if (status == AnimationStatus.dismissed) {
      // animationController.removeListener(mapMove);
      // animationController.reset();
    }
  });

  animationController.forward();
}
