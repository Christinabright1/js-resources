//Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ids from 'short-id';
import { Icon } from 'react-materialize';
import map from 'lodash/map';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
//Internals
import { COURSES } from '../../data/courses';

const CourseInfoBox = ({name, content}) => (
  <div className='course-info-box'>
    <h6>{name}</h6>
    <div className='course-info-box-content'>{content}</div>
  </div>
);

const CourseRating = ({rating}) => {
  let arr = new Array(rating).fill(0);
  return (
    <div className='rating-wrapper'>
    {map(arr, (star) => 
      <div id='rating' key={ ids.generate() }>
        <Icon small>star</Icon>
      </div>
    )}
    </div>
  );
}

const CourseInfoRow = ({first, course}) => {
  return (
    <div className='course-info-row'>
      <CourseInfoBox 
        name={first ? 'price' : 'framework'} 
        content={first ? `$${course.price}` : course.framework} />
      <div className='line' />
      <CourseInfoBox 
        name={first ? 'rating' : 'length'}
        content={first ? <CourseRating rating={course.rating} /> : `~${course.length} hrs` }/>
      <div className='line' />
      <CourseInfoBox 
        name={first ? 'level' : 'type'}
        content={first ? course.level : course.type} />
    </div>
  );
}

const Course = ({favoriteCourses, course, addFavoriteCourse}) => (
  <div className='course-wrapper'>
    <div className='icon-favorite' onClick={ () => addFavoriteCourse(course)}>
      <Icon small>{ favoriteCourses.has(course) ? 'star' : 'star_border' }</Icon>
    </div>
    <div className='thumbnail'>
      <img alt={course.name} className='course-img' src={course.img} />
    </div>
    <div className='course-details'>
      <h4 className='course-title'>{course.name}</h4>
      <h5 className='course-description'>{course.decription}</h5>
      <div className='course-info'>
        <CourseInfoRow first course={course} />
        <div className='line horizontal' />
        <CourseInfoRow course={course} />
      </div>
    </div>
    <a href={course.url} target='_blank'><button className='course-link'>Go To Resource</button></a>
  </div>
);

export class Courses extends Component  {
  render() {
    const {
      addFavoriteCourse,
      levels,
      frameworks,
      types,
      lengthValue,
      priceValue,
      searchValue,
      favoriteCourses,
      filterPaneOptions,
    } = this.props;
    const activeLevels = levels.length > 0 ? levels : filterPaneOptions.levels,
          activeTypes = types.length > 0 ? types : filterPaneOptions.types,
          activeFrameworks = frameworks.length > 0 ? frameworks : filterPaneOptions.frameworks;
    const filteredCourses = filter(COURSES, course => {
      if (searchValue === undefined) {
        return course;
      } else if (includes(course.name.toLowerCase(), searchValue.toLowerCase()) &&
                includes(activeLevels, course.level) &&
                includes(activeTypes, course.type) &&
                includes(activeFrameworks, course.framework) &&
                priceValue.min <= course.price &&
                priceValue.max >= course.price &&
                lengthValue.min <= course.length &&
                lengthValue.max >= course.length) return course;
    });

    return (
      <div className='courses-wrapper'>
        <div className='courses-list'>
          { !filteredCourses.length ? 
            <p className='empty-list'>Oh no! It doesn't seem like there are any resources that match your preferences!</p> :
            map(filteredCourses, (course) => (
              <Course 
                key={ ids.generate() }
                favoriteCourses={ favoriteCourses } 
                addFavoriteCourse={ addFavoriteCourse } 
                course={ course } /> 
            ))
          }
        </div>
      </div>
    );
  }
}

Courses.propTypes = {
  levels: PropTypes.arrayOf(PropTypes.string).isRequired,
  frameworks: PropTypes.arrayOf(PropTypes.string).isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  lengthValue: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
  priceValue: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
  searchValue: PropTypes.string.isRequired,
}