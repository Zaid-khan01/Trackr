const mongoose = require('mongoose');
const Application = require('../models/Application');

const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listApplications = async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const filter = { user: req.user.id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.search) {
    const search = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ company: search }, { role: search }];
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  return res.status(200).json({
    applications,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
};

const getApplicationStats = async (req, res) => {
  const [result] = await Application.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    {
      $group: {
        _id: null,
        counts: { $push: { k: '$_id', v: '$count' } },
        total: { $sum: '$count' },
        responded: {
          $sum: {
            $cond: [{ $eq: ['$_id', 'Applied'] }, 0, '$count'],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        counts: { $arrayToObject: '$counts' },
        total: 1,
        responseRate: {
          $multiply: [{ $divide: ['$responded', '$total'] }, 100],
        },
      },
    },
  ]);
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));

  if (result) {
    Object.assign(counts, result.counts);
  }

  return res.status(200).json({
    stats: {
      ...counts,
      total: result?.total || 0,
      responseRate: result?.responseRate || 0,
    },
  });
};

const createApplication = async (req, res) => {
  const { company, role, jobLink, status, dateApplied, notes } = req.body;
  const application = await Application.create({
    user: req.user.id,
    company,
    role,
    ...(jobLink !== undefined && { jobLink }),
    ...(status !== undefined && { status }),
    ...(dateApplied !== undefined && { dateApplied }),
    ...(notes !== undefined && { notes }),
  });

  return res.status(201).json({ application });
};

const getApplication = async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }

  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ application });
};

const updateApplication = async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }

  const { company, role, jobLink, status, dateApplied, notes } = req.body;
  const updates = Object.fromEntries(
    Object.entries({ company, role, jobLink, status, dateApplied, notes })
      .filter(([, value]) => value !== undefined)
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'At least one application field is required' });
  }

  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ application });
};

const deleteApplication = async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: 'Invalid application ID' });
  }

  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ message: 'Application deleted successfully' });
};

module.exports = {
  listApplications,
  getApplicationStats,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
};
