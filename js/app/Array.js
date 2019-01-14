Array.prototype.contains = function(val)  
{  
     for (var i = 0; i < this.length; i++)  
    {  
       if (this[i] == val)  
      {  
       return true;  
      }  
    }  
     return false;  
};