const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const {
  listApplications,
  getApplicationStats,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }

  return next();
};

const validateApplicationId = param('id').isMongoId().withMessage('A valid application ID is required');

const validateStatus = (field) =>
  body(field)
    .optional()
    .isIn(statuses)
    .withMessage(`Status must be one of: ${statuses.join(', ')}`);

router.use(authMiddleware);

router.get(
  '/',
  [
    query('search').optional().isString().withMessage('Search must be a string'),
    query('status').optional().isIn(statuses).withMessage(`Status must be one of: ${statuses.join(', ')}`),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    validateRequest,
  ],
  listApplications
);

router.get('/stats', getApplicationStats);

router.post(
  '/',
  [
    body('company').isString().trim().notEmpty().withMessage('Company is required'),
    body('role').isString().trim().notEmpty().withMessage('Role is required'),
    validateStatus('status'),
    body('jobLink')
      .optional()
      .isURL()
      .withMessage('Job link must be a valid URL'),
    body('dateApplied')
      .optional()
      .isISO8601()
      .withMessage('Date applied must be a valid date'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    validateRequest,
  ],
  createApplication
);

router.get('/:id', validateApplicationId, validateRequest, getApplication);

router.put(
  '/:id',
  [
    validateApplicationId,
    body('company').optional().isString().trim().notEmpty().withMessage('Company cannot be empty'),
    body('role').optional().isString().trim().notEmpty().withMessage('Role cannot be empty'),
    validateStatus('status'),
    body('jobLink')
      .optional()
      .isURL()
      .withMessage('Job link must be a valid URL'),
    body('dateApplied')
      .optional()
      .isISO8601()
      .withMessage('Date applied must be a valid date'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    validateRequest,
  ],
  updateApplication
);

router.delete('/:id', validateApplicationId, validateRequest, deleteApplication);

module.exports = router;
