

export const getRememberedDevices = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, hardwareFingerprints: [] });
  } catch (error) {
    next(error);
  }
};

export const trustDevice = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Hardware identifier marked as safe.' });
  } catch (error) {
    next(error);
  }
};

export const forgetDevice = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Device signature stripped from profile.' });
  } catch (error) {
    next(error);
  }
};