import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:geoform/geoform.dart';

void main() {
  const MethodChannel channel = MethodChannel('geoform');

  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    channel.setMockMethodCallHandler((MethodCall methodCall) async {
      return '42';
    });
  });

  tearDown(() {
    channel.setMockMethodCallHandler(null);
  });

  test('getPlatformVersion', () async {
    expect(await Geoform.platformVersion, '42');
  });
}
